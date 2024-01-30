/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 30.01.2024 04:13
 */

import React, {useRef, useState} from "react";
import {Button, Input} from "../../_components/form/component";
import {Icon} from "@sydsoft.com.tr/icon";

export default function Home() {
    const [showpassword, setShowPassword] = useState<boolean>(false)

    const passwordRef = useRef<any>(null)

    return (
        <main>
            <Input
                inputRef={passwordRef}
                label={"Şifre"}
                name={'sifre'}
                value={123}
                onChange={() => null}
                type={showpassword ? 'text' : 'password'}
                required={true}
                placeholder={'Şifrenizi giriniz...'}
                propsInput={{
                    minLength: 6
                }}
                endAdornment={(
                    <Button
                        onlyIcon={<Icon iconMui={showpassword ? 'visibility_off' : 'visibility'}/>}
                        onClick={() => {
                            setShowPassword(!showpassword)
                            passwordRef.current.focus()
                        }}
                        tabIndex={-1}
                        style={{color: '#737373'}}
                    />
                )}
            />
        </main>
    );
}
