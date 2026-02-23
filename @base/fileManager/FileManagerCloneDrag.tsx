/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-19 22:27:52
 */

import { FileManagerCloneDragProps } from './types';
import styles from './FileManager.module.css';

export default function CloneDrag({ data }: FileManagerCloneDragProps) {
    return (
        <div className={styles.cloneDrag} id={'clonedrag'}>
            <div className={'list'}>
                {data
                    .filter((file) => file.selected)
                    .map((file, index) => {
                        if (index > 1) return null;
                        return (
                            <div
                                key={index}
                                className={'file'}
                                style={{
                                    position: index === 0 ? 'relative' : 'absolute',
                                    left: index === 0 ? 0 : 5,
                                    top: index === 0 ? 0 : 5,
                                    zIndex: index === 0 ? 1 : -1,
                                    boxShadow: index === 0 ? 'none' : '0 0 14px #444'
                                    // border: (index === 0) ? "1px #00000070 solid" : "none",
                                }}
                            >
                                <img src={file.icon} alt={file.name} width={'auto'} height={'auto'} />
                                <span>{file.name}</span>
                            </div>
                        );
                    })}
                <div className={'count'}>{data.filter((file) => file.selected).length} Dosya</div>
            </div>
        </div>
    );
}
