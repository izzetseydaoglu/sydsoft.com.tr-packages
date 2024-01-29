/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */
import Link from "next/link";
import React, {ReactNode} from "react";
import {LinkProps} from "next/dist/client/link";


interface Props extends LinkProps {
    href: string,
    hrefLang?: string,
    children: ReactNode,
    // onClick?: (e: React.MouseEvent<HTMLLinkElement>) => void,
    target?: string,
    style?: React.CSSProperties,
    className?: string,
    title?: string,
}


const Slink: React.FC<Props> = React.memo(({href, hrefLang, target, style, className, children, title, ...others}) => {
    return (
        <Link href={href} className={className}
              style={style}
              target={target}
              hrefLang={hrefLang}
              title={title}
              {...others}
        >
            {children}
        </Link>
    );
})
export default Slink;