/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-19 01:55:59
 */

'use client';

import { useCallback, useMemo, useState } from 'react';

type typeGoogleDrivePickedFile = {
    id: string;
    name: string;
    base64: string;
    mimeType?: string;
};

export type typeGoogleDriveListItem = {
    id: string;
    name: string;
    mimeType: string;
    iconLink?: string;
    modifiedTime?: string;
    size?: string;
    parents?: string[];
    md5Checksum?: string;
};

export type typeGoogleDriveFileManagerItem = {
    id: string;
    name: string;
    parent: string;
    mimeType: string;
    fileExtension: string;
    icon: string;
    size: number;
    modifiedTime: string;
    isFolder: boolean;
    md5: string;
};

type typeGoogleDriveServiceConfig = {
    clientID: string;
    scope?: string;
};

type typeUseGoogleDrivePickerParams = {
    clientID: string;
    scope?: string;
};

const defaultScope = 'https://www.googleapis.com/auth/drive.readonly';
const FOLDER_ICON = 'https://www.gstatic.com/images/icons/material/system/2x/folder_open_black_24dp.png';
const FILE_ICON = 'https://www.gstatic.com/images/icons/material/system/2x/insert_drive_file_black_24dp.png';

function isBrowser() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function isGoogleWorkspaceMimeType(mimeType: string = '') {
    return mimeType.startsWith('application/vnd.google-apps.');
}

function getWorkspaceExportCandidates(mimeType: string) {
    const map: Record<string, { mimeType: string; extension: string }[]> = {
        'application/vnd.google-apps.document': [
            { mimeType: 'application/pdf', extension: 'pdf' },
            { mimeType: 'text/plain', extension: 'txt' }
        ],
        'application/vnd.google-apps.spreadsheet': [
            { mimeType: 'application/pdf', extension: 'pdf' },
            { mimeType: 'text/csv', extension: 'csv' }
        ],
        'application/vnd.google-apps.presentation': [{ mimeType: 'application/pdf', extension: 'pdf' }],
        'application/vnd.google-apps.drawing': [{ mimeType: 'image/png', extension: 'png' }]
    };

    return map[mimeType] || [{ mimeType: 'application/pdf', extension: 'pdf' }];
}

function escapeDriveQuery(value: string) {
    return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function ensureScriptLoaded(src: string): Promise<void> {
    if (!isBrowser()) return;

    const exists = Array.from(document.getElementsByTagName('script')).some((s) => s.src === src);
    if (exists) return;

    await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Script yuklenemedi: ${src}`));
        document.head.appendChild(script);
    });
}

class GoogleDriveService {
    private readonly clientID: string;
    private readonly scope: string;
    private tokenClient: any = null;
    private accessToken: string | null = null;
    private accessTokenExpiresAt = 0;
    private isReady = false;

    constructor(config: typeGoogleDriveServiceConfig) {
        this.clientID = config.clientID;
        this.scope = config.scope || defaultScope;
    }

    public async ensureReady(): Promise<boolean> {
        if (this.isReady) return true;

        if (!isBrowser()) return false;
        if (!this.clientID) return false;

        await ensureScriptLoaded('https://accounts.google.com/gsi/client');

        const google = (window as any).google;
        if (!google?.accounts?.oauth2) {
            return false;
        }

        this.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: this.clientID,
            scope: this.scope,
            callback: () => {}
        });

        this.isReady = true;
        return true;
    }

    public async requestAccessToken(forceConsent: boolean = false): Promise<string | null> {
        if (!this.tokenClient) return null;

        return await new Promise<string | null>((resolve) => {
            this.tokenClient.callback = (tokenResponse: any) => {
                if (tokenResponse?.error || !tokenResponse?.access_token) {
                    resolve(null);
                    return;
                }
                const expiresIn = Number(tokenResponse?.expires_in || 3600);
                this.accessTokenExpiresAt = Date.now() + Math.max(0, expiresIn - 60) * 1000;
                resolve(tokenResponse.access_token);
            };
            this.tokenClient.requestAccessToken({ prompt: forceConsent ? 'consent' : '' });
        });
    }

    public async connect(): Promise<string | null> {
        const ready = await this.ensureReady();
        if (!ready) return null;
        const token = await this.requestAccessToken(true);
        this.accessToken = token;
        return token;
    }

    public setAccessToken(token: string, expiresInSec: number = 3600) {
        this.accessToken = token;
        this.accessTokenExpiresAt = Date.now() + Math.max(0, expiresInSec - 60) * 1000;
    }

    public clearAccessToken() {
        this.accessToken = null;
        this.accessTokenExpiresAt = 0;
    }

    private async getAccessToken(): Promise<string | null> {
        if (this.accessToken && Date.now() < this.accessTokenExpiresAt) {
            return this.accessToken;
        }
        const token = await this.requestAccessToken(false);
        if (token) {
            this.accessToken = token;
        }
        return token;
    }

    private async authFetch(input: RequestInfo | URL, init?: RequestInit, retryAuth: boolean = true): Promise<Response> {
        const accessToken = await this.getAccessToken();
        if (!accessToken) {
            throw new Error('Google token alinamadi.');
        }

        const headers = new Headers(init?.headers || {});
        headers.set('Authorization', `Bearer ${accessToken}`);
        const response = await fetch(input, { ...init, headers });

        if ((response.status === 401 || response.status === 403) && retryAuth) {
            const refreshed = await this.requestAccessToken(false);
            if (!refreshed) return response;
            this.accessToken = refreshed;
            return this.authFetch(input, init, false);
        }

        return response;
    }

    private arrayBufferToBase64(buffer: ArrayBuffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
        }
        return btoa(binary);
    }
    private async blobToBase64(blob: Blob): Promise<string> {
        const buffer = await blob.arrayBuffer();
        return this.arrayBufferToBase64(buffer);
    }

    private ensureFileExtension(fileName: string, extension: string) {
        const lower = fileName.toLowerCase();
        if (lower.endsWith(`.${extension.toLowerCase()}`)) return fileName;
        return `${fileName}.${extension}`;
    }

    private saveBlobAsFile(blob: Blob, fileName: string) {
        if (!isBrowser()) return false;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        return true;
    }

    private async fetchWorkspaceExportBlob(fileID: string, fileName: string, mimeType: string): Promise<{ blob: Blob; name: string; mimeType: string } | null> {
        const candidates = getWorkspaceExportCandidates(mimeType);

        for (const candidate of candidates) {
            const response = await this.authFetch(
                `https://www.googleapis.com/drive/v3/files/${fileID}/export?mimeType=${encodeURIComponent(candidate.mimeType)}`
            );
            if (!response.ok) continue;

            const blob = await response.blob();
            return {
                blob,
                name: this.ensureFileExtension(fileName, candidate.extension),
                mimeType: candidate.mimeType
            };
        }

        return null;
    }

    private async fetchWorkspaceExport(fileID: string, fileName: string, mimeType: string): Promise<typeGoogleDrivePickedFile | null> {
        const exported = await this.fetchWorkspaceExportBlob(fileID, fileName, mimeType);
        if (!exported) return null;
        const base64 = await this.blobToBase64(exported.blob);
        return {
            id: fileID,
            name: exported.name,
            mimeType: exported.mimeType,
            base64
        };
    }

    public async fetchFileById(fileID: string): Promise<typeGoogleDrivePickedFile | null> {
        try {
            const metaRes = await this.authFetch(`https://www.googleapis.com/drive/v3/files/${fileID}?fields=id,name,mimeType`);
            if (!metaRes.ok) return null;
            const meta = await metaRes.json();
            const mimeType = meta?.mimeType || '';
            const fileName = meta?.name || 'Belge.udf';

            if (isGoogleWorkspaceMimeType(mimeType)) {
                return await this.fetchWorkspaceExport(meta?.id || fileID, fileName, mimeType);
            }

            const contentRes = await this.authFetch(`https://www.googleapis.com/drive/v3/files/${fileID}?alt=media`);
            if (!contentRes.ok) return null;

            const blob = await contentRes.blob();
            const base64 = await this.blobToBase64(blob);
            return {
                id: meta?.id || fileID,
                name: fileName,
                mimeType,
                base64
            };
        } catch {
            return null;
        }
    }

    public async downloadFile(fileID: string, fileNameHint?: string): Promise<boolean> {
        try {
            const metaRes = await this.authFetch(`https://www.googleapis.com/drive/v3/files/${fileID}?fields=id,name,mimeType`);
            if (!metaRes.ok) return false;
            const meta = await metaRes.json();
            const mimeType = meta?.mimeType || '';
            const fileName = fileNameHint || meta?.name || 'Belge';

            if (isGoogleWorkspaceMimeType(mimeType)) {
                const exported = await this.fetchWorkspaceExportBlob(meta?.id || fileID, fileName, mimeType);
                if (!exported) return false;
                return this.saveBlobAsFile(exported.blob, exported.name);
            }

            const contentRes = await this.authFetch(`https://www.googleapis.com/drive/v3/files/${fileID}?alt=media`);
            if (!contentRes.ok) return false;
            const blob = await contentRes.blob();
            return this.saveBlobAsFile(blob, fileName);
        } catch {
            return false;
        }
    }

    public async listFiles(folderId: string = 'root', search: string = '', pageSize: number = 100): Promise<typeGoogleDriveListItem[]> {
        const qParts: string[] = ['trashed = false'];

        if (folderId) {
            qParts.push(`'${escapeDriveQuery(folderId)}' in parents`);
        }

        if (search.trim()) {
            qParts.push(`name contains '${escapeDriveQuery(search.trim())}'`);
        }

        const query = new URLSearchParams({
            q: qParts.join(' and '),
            pageSize: String(pageSize),
            orderBy: 'folder,name,modifiedTime desc',
            includeItemsFromAllDrives: 'true',
            supportsAllDrives: 'true',
            fields: 'files(id,name,mimeType,iconLink,modifiedTime,size,parents,md5Checksum)'
        });

        const response = await this.authFetch(`https://www.googleapis.com/drive/v3/files?${query.toString()}`);

        if (!response.ok) {
            throw new Error('Drive dosya listesi alinamadi.');
        }

        const json = await response.json();
        return (json?.files || []) as typeGoogleDriveListItem[];
    }

    public async searchFiles(search: string, pageSize: number = 100) {
        return this.listFiles('', search, pageSize);
    }

    private async getFileParents(fileID: string) {
        const response = await this.authFetch(`https://www.googleapis.com/drive/v3/files/${fileID}?fields=parents&supportsAllDrives=true`);

        if (!response.ok) return [];
        const json = await response.json();
        return (json?.parents || []) as string[];
    }

    public async moveFiles(targetFolderID: string, files: typeGoogleDriveFileManagerItem[]) {
        const moveCandidates = files.filter((file) => file.id !== targetFolderID);

        if (!targetFolderID || moveCandidates.length === 0) {
            return { moved: 0, failed: 0 };
        }

        const results = await Promise.all(
            moveCandidates.map(async (file) => {
                try {
                    const knownParents = file.parent ? [file.parent] : [];
                    const parents = knownParents.length > 0 ? knownParents : await this.getFileParents(file.id);
                    const removeParents = parents.filter((parentID) => parentID && parentID !== targetFolderID).join(',');

                    if (parents.includes(targetFolderID)) {
                        return { ok: true, moved: false };
                    }

                    const query = new URLSearchParams({
                        addParents: targetFolderID,
                        supportsAllDrives: 'true'
                    });

                    if (removeParents) {
                        query.set('removeParents', removeParents);
                    }

                    const response = await this.authFetch(`https://www.googleapis.com/drive/v3/files/${file.id}?${query.toString()}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({})
                    });

                    if (!response.ok) {
                        return { ok: false, moved: false };
                    }

                    return { ok: true, moved: true };
                } catch {
                    return { ok: false, moved: false };
                }
            })
        );

        return {
            moved: results.filter((r) => r.ok && r.moved).length,
            failed: results.filter((r) => !r.ok).length
        };
    }

    public async deleteFiles(files: typeGoogleDriveFileManagerItem[]) {
        if (files.length === 0) {
            return { deleted: 0, failed: 0 };
        }

        const results = await Promise.all(
            files.map(async (file) => {
                try {
                    const response = await this.authFetch(`https://www.googleapis.com/drive/v3/files/${file.id}?supportsAllDrives=true`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ trashed: true })
                    });

                    return response.ok;
                } catch {
                    return false;
                }
            })
        );

        return {
            deleted: results.filter(Boolean).length,
            failed: results.filter((ok) => !ok).length
        };
    }

    public async uploadFiles(targetFolderID: string, files: FileList | File[]) {
        const fileArray = Array.from(files || []);
        if (!targetFolderID || fileArray.length === 0) {
            return { uploaded: 0, failed: 0 };
        }

        const results = await Promise.all(
            fileArray.map(async (file) => {
                try {
                    const boundary = `drive_upload_${Date.now()}_${Math.random().toString(16).slice(2)}`;
                    const metadata = {
                        name: file.name,
                        parents: [targetFolderID]
                    };

                    const body = new Blob([
                        `--${boundary}\r\n`,
                        'Content-Type: application/json; charset=UTF-8\r\n\r\n',
                        JSON.stringify(metadata),
                        `\r\n--${boundary}\r\n`,
                        `Content-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`,
                        file,
                        `\r\n--${boundary}--`
                    ]);

                    const response = await this.authFetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true', {
                        method: 'POST',
                        headers: {
                            'Content-Type': `multipart/related; boundary=${boundary}`
                        },
                        body
                    });

                    return response.ok;
                } catch {
                    return false;
                }
            })
        );

        return {
            uploaded: results.filter(Boolean).length,
            failed: results.filter((ok) => !ok).length
        };
    }

    public mapFilesToFileManager(files: typeGoogleDriveListItem[]): typeGoogleDriveFileManagerItem[] {
        return files.map((file) => {
            const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
            const extension = isFolder ? '' : (file.name.split('.').pop() || '').toLowerCase();
            const parent = file.parents?.[0] || '';
            const size = Number(file.size || 0);

            return {
                id: file.id,
                name: file.name,
                parent,
                mimeType: file.mimeType || '',
                fileExtension: extension,
                icon: file.iconLink || (isFolder ? FOLDER_ICON : FILE_ICON),
                size: Number.isNaN(size) ? 0 : size,
                modifiedTime: file.modifiedTime || new Date().toISOString(),
                isFolder,
                md5: file.md5Checksum || ''
            };
        });
    }
}

export function useGoogleDrivePicker({ clientID, scope }: typeUseGoogleDrivePickerParams) {
    const [error, setError] = useState<string>('');

    const service = useMemo(
        () =>
            new GoogleDriveService({
                clientID,
                scope
            }),
        [clientID, scope]
    );

    const connect = useCallback(async () => {
        try {
            const accessToken = await service.connect();
            if (!accessToken) {
                setError('Google token alinamadi.');
                return null;
            }
            setError('');
            return accessToken;
        } catch (e: any) {
            setError(e?.message || 'Google Drive baglantisi sirasinda hata olustu.');
            return null;
        }
    }, [service]);

    const setAccessToken = useCallback(
        (token: string, expiresInSec: number = 3600) => {
            service.setAccessToken(token, expiresInSec);
            setError('');
        },
        [service]
    );

    const clearAccessToken = useCallback(() => {
        service.clearAccessToken();
    }, [service]);

    const listFiles = useCallback(
        async (folderId?: string, search: string = '', pageSize: number = 100) => {
            try {
                return await service.listFiles(folderId, search, pageSize);
            } catch (e: any) {
                setError(e?.message || 'Drive dosya listesi alinamadi.');
                return [];
            }
        },
        [service]
    );

    const searchFiles = useCallback(
        async (search: string, pageSize: number = 100) => {
            try {
                return await service.searchFiles(search, pageSize);
            } catch (e: any) {
                setError(e?.message || 'Drive arama basarisiz.');
                return [];
            }
        },
        [service]
    );

    const openFile = useCallback(
        async (fileID: string) => {
            try {
                return await service.fetchFileById(fileID);
            } catch (e: any) {
                setError(e?.message || 'Drive dosyasi acilamadi.');
                return null;
            }
        },
        [service]
    );

    const downloadFile = useCallback(
        async (fileID: string, fileNameHint?: string) => {
            try {
                return await service.downloadFile(fileID, fileNameHint);
            } catch (e: any) {
                setError(e?.message || 'Drive dosyasi indirilemedi.');
                return false;
            }
        },
        [service]
    );

    const moveFiles = useCallback(
        async (targetFolderID: string, files: typeGoogleDriveFileManagerItem[]) => {
            try {
                return await service.moveFiles(targetFolderID, files);
            } catch (e: any) {
                setError(e?.message || 'Drive tasima islemi basarisiz.');
                return { moved: 0, failed: files.length };
            }
        },
        [service]
    );

    const deleteFiles = useCallback(
        async (files: typeGoogleDriveFileManagerItem[]) => {
            try {
                return await service.deleteFiles(files);
            } catch (e: any) {
                setError(e?.message || 'Drive silme islemi basarisiz.');
                return { deleted: 0, failed: files.length };
            }
        },
        [service]
    );

    const uploadFiles = useCallback(
        async (targetFolderID: string, files: FileList | File[]) => {
            try {
                return await service.uploadFiles(targetFolderID, files);
            } catch (e: any) {
                setError(e?.message || 'Drive yukleme islemi basarisiz.');
                return { uploaded: 0, failed: Array.from(files || []).length };
            }
        },
        [service]
    );

    const mapFilesToFileManager = useCallback((files: typeGoogleDriveListItem[]) => service.mapFilesToFileManager(files), [service]);

    return {
        error,
        connect,
        setAccessToken,
        clearAccessToken,
        listFiles,
        searchFiles,
        openFile,
        downloadFile,
        moveFiles,
        deleteFiles,
        uploadFiles,
        mapFilesToFileManager
    };
}
