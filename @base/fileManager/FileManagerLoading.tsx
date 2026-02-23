/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-19 03:14:37
 */

import styles from './FileManager.module.css';

export const Loading = ({ show }: { show: boolean }) => {
    if (!show) return null;
    return (
        <div className={styles.loadingOverlay}>
            <div className={'loading_spinner'} />
        </div>
    );
};
