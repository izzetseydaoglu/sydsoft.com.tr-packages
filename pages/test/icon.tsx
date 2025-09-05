import { Box, BoxContent, BoxFooter, BoxHeader } from "@/@base";
import { Icon, iconList } from "@sydsoft/base";

import { customIcons } from "../customIcons";

export default function Test() {
    return (
        <Box style={{ margin: 10, maxHeight: 300 }}>
            <BoxHeader>IconList</BoxHeader>
            <BoxContent style={{ display: "flex", flexWrap: "wrap", gap: 30 }}>
                {iconList.map((item: any, index:number) => (
                    <div key={index} title={item} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Icon name={item} />
                        <b style={{ fontSize: 15, marginTop: 5 }}>{item}</b>
                    </div>
                ))}
                <br />
                Custon ICON = <Icon customIcon={customIcons.logo} fontSize={50}/>
                Custon ICON2 = <Icon name="logo" fontSize={50}/>
                Icon Yok= <Icon name="karşılıksız" />
                Icon Yok= <Icon name="logo2" />
                Icon Yok= <Icon name={"close"} />
            </BoxContent>
            <BoxFooter>Footer</BoxFooter>
        </Box>
    );
}
