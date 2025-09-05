import { Box, BoxContent, BoxFooter, BoxHeader, Button, Icon, Popover, isDev } from "@/@base";
import { Menu, typeMenu } from "@/@base/menu";

export default function Test() {
    const menu: typeMenu[] = [
        {
            title: "Boş Menu",
            icon: <Icon name="edit" color="red"/>
        },
        {
            title: "Dialog",
            icon: <Icon name="edit" />,
            onClick: () => {
                isDev && console.log("test");
            },
            dialog: {
                message: "test",
                acceptButtonText: "testEvet",
                cancelButtonText: "testHayır"
            }
        },
        {
            title: "Link Menu",
            icon: <Icon name="edit" />,
            href: "/"
        },
        {
            seperator: true
        },
        {
            title: "Iconsuz"
        },
        {
            fullComponent: (
                <div style={{ padding: 10, background: "#445", color: "#fff" }}>
                    <p>test Full Component</p>
                </div>
            )
        }
    ];
    return (
        <Box style={{ margin: 10 }}>
            <BoxHeader>
                <span>Menu</span>
                <Popover
                    Component={
                        <Button buttonClass="primary" buttonSize="small" style={{ float: "right" }}>
                            Menu
                        </Button>
                    }>
                    <Menu menu={menu} withIcon={false} />
                </Popover>
            </BoxHeader>
            <BoxContent>
                <Menu menu={menu} withIcon={true} />
            </BoxContent>
            <BoxFooter>
                <Popover
                    Component={
                        <Button buttonClass="primary" buttonSize="small">
                            Menu
                        </Button>
                    }>
                    <Menu menu={menu} withIcon={true} />
                </Popover>
            </BoxFooter>
        </Box>
    );
}
