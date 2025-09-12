import { Box, BoxContent, BoxFooter, BoxHeader, Icon } from "@/@base";

export default function Test() {
    return (
        <Box style={{ margin: 10, maxHeight: 300 }}>
            <BoxHeader
                component={"h1"}
                icon={<Icon iconMui={"inbox"} />}
                menu={
                    <>
                        <span>1</span>
                        <span>2</span>
                    </>
                }>
                ZorbaTitle
            </BoxHeader>
            <BoxContent>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>
                <p>Deneme</p>

            </BoxContent>
            <BoxFooter>Footer</BoxFooter>
        </Box>
    );
}
