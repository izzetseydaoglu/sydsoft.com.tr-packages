/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-10 20:23:07
 */

import React, { ReactNode } from 'react';
import { Box, BoxFooter } from '../box';

import { createRoot } from 'react-dom/client';
import { Modal } from '../modal';
import { Button } from './Button';

export type propsDialog = {
    message: any;
    acceptButtonShow?: boolean;
    cancelButtonShow?: boolean;
    acceptButtonText?: string | ReactNode;
    cancelButtonText?: string | ReactNode;
    acceptButtonClass?: 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link';
    cancelButtonClass?: 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link';
    vertialAlign?: 'flex-start' | 'center' | 'flex-end';
    horizontalAlign?: 'flex-start' | 'center' | 'flex-end';
    hideBackdrop?: boolean;
    hideEsc?: boolean;
    styleMessage?: React.CSSProperties;
    styleBox?: React.CSSProperties;
    styleBoxFooter?: React.CSSProperties;
    autoFocus?: 'accept' | 'cancel';
    backdropStyle?: React.CSSProperties;
};

export const Dialog = (config: propsDialog) =>
    new Promise((resolve) => {
        if (typeof window === 'undefined') return false;
        let mainDiv: any = document.getElementById('sdialog');
        if (!mainDiv) {
            const createDiv = document.createElement('div');
            createDiv.setAttribute('id', 'sdialog');
            document.body.appendChild(createDiv);
            mainDiv = createDiv;
        }
        const root = createRoot(mainDiv!);
        const settings: propsDialog = {
            acceptButtonShow: true,
            cancelButtonShow: true,
            acceptButtonText: 'EVET',
            cancelButtonText: 'HAYIR',
            acceptButtonClass: 'danger',
            cancelButtonClass: 'secondary',
            vertialAlign: 'center',
            horizontalAlign: 'center',
            hideBackdrop: true,
            hideEsc: true,
            styleMessage: {
                fontSize: '1.1rem',
                padding: '10px 20px'
            },
            styleBox: { padding: 0, margin: 0, minWidth: 250 },
            styleBoxFooter: { padding: '8px 5px' },
            autoFocus: 'accept',
            ...config
        };

        const close = () => {
            if (mainDiv) {
                root.unmount();
                mainDiv.remove();
            }
        };

        const onCancel = () => {
            resolve(false);
            close();
        };

        const onAccept = () => {
            resolve(true);
            close();
        };

        const Component = (
            <Modal
                open={true}
                keepMounted={false}
                close={onCancel}
                hideBackdrop={settings.hideBackdrop}
                hideEsc={settings.hideEsc}
                hideCloseButton={true}
                vertialAlign={settings.vertialAlign}
                horizontalAlign={settings.horizontalAlign}
                backdropStyle={settings.backdropStyle}
            >
                <Box style={settings.styleBox}>
                    <div className="sbox_content" style={settings.styleMessage} dangerouslySetInnerHTML={{ __html: settings.message }} />

                    {(settings.acceptButtonShow || settings.cancelButtonShow) && (
                        <BoxFooter style={settings.styleBoxFooter}>
                            {settings.cancelButtonShow && (
                                <Button autoFocus={settings.autoFocus === 'cancel'} buttonClass={settings.cancelButtonClass} onClick={onCancel}>
                                    {settings.cancelButtonText}
                                </Button>
                            )}
                            {settings.acceptButtonShow && (
                                <Button autoFocus={settings.autoFocus === 'accept'} buttonClass={settings.acceptButtonClass} onClick={onAccept}>
                                    {settings.acceptButtonText}
                                </Button>
                            )}
                        </BoxFooter>
                    )}
                </Box>
            </Modal>
        );
        root.render(Component);
    });
