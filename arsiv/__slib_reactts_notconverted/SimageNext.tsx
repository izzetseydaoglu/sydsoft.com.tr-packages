/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */

import React from "react";
import Image from "next/image";
import {ImageProps} from "next/dist/client/image";

interface Props extends ImageProps {
    src: string,
    alt: string,
    style?: React.CSSProperties,
    // layout?: "fixed" | "fill" | "intrinsic" | "responsive" | undefined,
    // objectFit?: "inherit" | "initial" | "revert" | "unset" | "contain" | "cover" | "fill" | "none" | "scale-down" | undefined
}

const SimageNext: React.FC<Props> = React.memo(({src, alt, layout = "intrinsic", objectFit = "cover", ...res}) => {
    return <Image loader={({src, width, quality}) => `${src}?w=${width}&q=${quality || 100}`}
                  src={src}
                  alt={alt}
                  {...res}
    />;
})
export default SimageNext;
