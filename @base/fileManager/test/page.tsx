'use client';

import { Icon, useFileManager } from '@/ui';
import { typeGoogleDriveFileManagerItem, useGoogleDrivePicker } from '@/features/plugins/googleDrive/useGoogleDrivePicker';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/ui/form/Button';
import { FileManagerFile } from '@/ui/fileManager/types';

export default function Test() {
    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/drive';
    const SESSION_TOKEN_KEY = 'gdrive_access_token';
    const SESSION_TOKEN_EXPIRES_AT_KEY = 'gdrive_access_token_expires_at';

    const ROOT_FOLDER = useMemo(() => ({ id: 'root', name: 'Google Drive' }), []);
    const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const restoredSessionRef = useRef<boolean>(false);

    const drive = useGoogleDrivePicker({
        clientID: GOOGLE_CLIENT_ID,
        scope: GOOGLE_SCOPE
    });

    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [files, setFiles] = useState<typeGoogleDriveFileManagerItem[]>([]);
    const [currentFolderID, setCurrentFolderID] = useState<string>('root');
    const [selectedFiles, setSelectedFiles] = useState<typeGoogleDriveFileManagerItem[]>([]);
    const [statusText, setStatusText] = useState<string>('Bağlantı bekleniyor.');

    const ensureConnected = useCallback(() => {
        if (!isConnected) {
            setStatusText('Önce Google Drive bağlantısını kur.');
            return false;
        }
        return true;
    }, [isConnected]);

    const loadFolder = useCallback(
        async (folderID: string) => {
            fileManager.setLoading(true);
            const list = await drive.listFiles(folderID);
            setFiles(drive.mapFilesToFileManager(list));
            setCurrentFolderID(folderID);
            fileManager.setLoading(false);
        },
        [drive]
    );

    const openDriveItem = useCallback(
        async (file: typeGoogleDriveFileManagerItem) => {
            if (!ensureConnected()) return false;
            if (file.isFolder) {
                await loadFolder(file.id);
                setStatusText(`Klasör: ${file.name}`);

                return true;
            }

            const opened = await drive.openFile(file.id);
            if (!opened?.base64) {
                setStatusText('Dosya açılamadı.');
                return false;
            }
            console.log(opened);

            setStatusText(`Açıldı: ${opened.name}`);
            return true;
        },
        [ensureConnected, drive, loadFolder]
    );

    const runSearch = useCallback(
        async (search: string) => {
            if (!ensureConnected()) return;
            fileManager.setLoading(true);
            if (!search.trim()) {
                await loadFolder(currentFolderID);
                return;
            }

            const list = await drive.searchFiles(search);
            setFiles(drive.mapFilesToFileManager(list));
            fileManager.setLoading(false)
        },
        [ensureConnected, currentFolderID, drive, loadFolder]
    );

    const deleteFiles = useCallback(
        async (targets: typeGoogleDriveFileManagerItem[]) => {
            if (!ensureConnected()) return;
            if (targets.length === 0) {
                setStatusText('Silmek için en az bir dosya seç.');
                return;
            }

            const result = await drive.deleteFiles(targets);

            await loadFolder(currentFolderID);
            setSelectedFiles([]);
            setStatusText(`Silindi: ${result.deleted}, Hata: ${result.failed}`);
        },
        [ensureConnected, currentFolderID, drive, loadFolder]
    );

    const fileManager = useFileManager({
        files: files as any,
        rootFolder: ROOT_FOLDER,
        multipleSelect: true,
        onSelect: (list) => setSelectedFiles(list as typeGoogleDriveFileManagerItem[]),
        onChangeFolder: async (folder) => {
            await loadFolder(folder.id);
            setStatusText(`Klasör: ${folder.name}`);
        },
        onSearch: (searchText) => {
            if (searchTimerRef.current) {
                clearTimeout(searchTimerRef.current);
            }
            searchTimerRef.current = setTimeout(() => {
                runSearch(searchText).catch(() => setStatusText('Arama sırasında hata oluştu.'));
            }, 300);
        },
        onDoubleClick: async (file) => {
            await openDriveItem(file as typeGoogleDriveFileManagerItem);
        },
        onDrop: async (targetID, dropFiles) => {
            if (!ensureConnected()) return;

            const result = await drive.moveFiles(targetID, dropFiles as typeGoogleDriveFileManagerItem[]);

            await loadFolder(currentFolderID);
            setStatusText(`Taşındı: ${result.moved}, Hata: ${result.failed}`);
        },
        onUpload: async (targetID, uploadFiles) => {
            if (!ensureConnected()) return;

            const result = await drive.uploadFiles(targetID, uploadFiles);

            if (targetID === currentFolderID) {
                await loadFolder(currentFolderID);
            }
            setStatusText(`Yüklendi: ${result.uploaded}, Hata: ${result.failed}`);
        },
        onClick: (file) => {
            console.log('Clicked file:', file);
        },

        settings: {
            orderBy: 'name',
            order: 'asc',
            sortable: true,
            searchable: true,
            search: ''
        },

        menu: [
            (file: FileManagerFile | undefined, files: FileManagerFile[]) => ({
                name: 'Test Çoklu',
                icon: <Icon iconMui={'open_in_new'} />,
                onClick: async () => {
                    console.log(files);
                }
            }),
            (file: FileManagerFile | undefined) => ({
                name: 'Aç',
                icon: <Icon iconMui={'open_in_new'} />,
                onClick: async () => {
                    if (!file) return;
                    await openDriveItem(file as typeGoogleDriveFileManagerItem);
                },
                hideInContextMenu: false,
                hideInMenu: false,
                disabled: !file
            }),
            (file: FileManagerFile | undefined) => ({
                name: 'İndir',
                icon: <Icon iconMui={'download'} />,
                onClick: async () => {
                    if (!file || file.isFolder) return;
                    if (!ensureConnected()) return;
                    const ok = await drive.downloadFile(file.id, file.name);
                    setStatusText(ok ? `İndirildi: ${file.name}` : `İndirilemedi: ${file.name}`);
                },
                hideInContextMenu: !!file?.isFolder,
                disabled: !file || !!file?.isFolder
            }),
            (file: FileManagerFile | undefined, allFiles: FileManagerFile[]) => ({
                name: 'Sil',
                icon: <Icon iconMui={'delete'} />,
                onClick: async () => {
                    const selected = allFiles.filter((item) => item.selected);
                    const targets = file ? (file.selected ? selected : [file]) : selected;
                    await deleteFiles(targets as typeGoogleDriveFileManagerItem[]);
                },
                disabled: !file && allFiles.filter((item) => item.selected).length === 0
            })
        ]
    });

    useEffect(() => {
        return () => {
            if (searchTimerRef.current) {
                clearTimeout(searchTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (restoredSessionRef.current) return;
        restoredSessionRef.current = true;

        const savedToken = window.sessionStorage.getItem(SESSION_TOKEN_KEY);
        const savedExpiresAt = Number(window.sessionStorage.getItem(SESSION_TOKEN_EXPIRES_AT_KEY) || 0);
        if (!savedToken || !savedExpiresAt || savedExpiresAt <= Date.now()) {
            window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
            window.sessionStorage.removeItem(SESSION_TOKEN_EXPIRES_AT_KEY);
            return;
        }

        const remainingSec = Math.max(1, Math.floor((savedExpiresAt - Date.now()) / 1000));
        drive.setAccessToken(savedToken, remainingSec);
        setIsConnected(true);
        loadFolder('root')
            .then(() => setStatusText('Google Drive oturumu yüklendi.'))
            .catch(() => setStatusText('Kayıtlı oturum var ama klasör yüklenemedi.'));
    }, [drive, loadFolder]);

    const connectAndLoadRoot = async () => {
        try {
            setStatusText('Google Drive bağlantısı başlatılıyor...');
            const token = await drive.connect();
            if (!token) {
                setStatusText('Bağlantı kurulamadı. Client ID / API Key kontrol et.');
                return;
            }

            const expiresAt = Date.now() + 55 * 60 * 1000;
            window.sessionStorage.setItem(SESSION_TOKEN_KEY, token);
            window.sessionStorage.setItem(SESSION_TOKEN_EXPIRES_AT_KEY, String(expiresAt));

            setIsConnected(true);
            await loadFolder('root');
            setStatusText('Google Drive bağlandı.');
        } catch {
            setStatusText('Google Drive bağlantısında hata oluştu.');
        }
    };

    const openFirstSelected = async () => {
        if (!ensureConnected()) return;
        if (selectedFiles.length === 0) {
            setStatusText('Açmak için en az bir dosya seç.');
            return;
        }

        const first = selectedFiles[0];
        await openDriveItem(first);
    };

    const deleteSelected = async () => {
        await deleteFiles(selectedFiles);
    };

    return (
        <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <Button href="/">Anasayfa</Button>
                <Button onClick={connectAndLoadRoot}>Drive Bağlan + Listele</Button>
                <Button onClick={openFirstSelected}>Seçiliyi Aç</Button>
                <Button onClick={deleteSelected}>Seçiliyi Sil</Button>
            </div>
            <div style={{ marginBottom: 12, fontSize: 14 }}>
                <div>{statusText}</div>
                <div>Aktif klasör ID: {currentFolderID}</div>
                <div>Seçili öğe sayısı: {selectedFiles.length}</div>
            </div>
            {fileManager.Component}
        </div>
    );
}
