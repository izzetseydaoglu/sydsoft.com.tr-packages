import { Box, BoxContent, BoxFooter, BoxHeader, Button, Icon, Menu, Popover, isDev, typeMenu } from '@/@base';

import React from 'react';
import styled from 'styled-components';

type MenuItem = {
    type: 'menu' | 'submenu' | 'button' | 'fullComponent';
    items?: typeMenu[];
    title?: string;
    onClick?: () => void;
    href?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    fullComponent?: React.ReactElement;
    menuProps?: {
        style?: React.CSSProperties;
        [key: string]: any;
    };
};

export default function Test() {
    const menu: typeMenu[] = [
        {
            title: 'Boş Menu',
            icon: <Icon name="edit" color="red" />
        },
        {
            title: 'Dialog',
            icon: <Icon name="edit" />,
            onClick: () => {
                isDev && console.log('test');
            },
            dialog: {
                message: 'test',
                acceptButtonText: 'testEvet',
                cancelButtonText: 'testHayır'
            }
        },
        {
            title: 'Link Menu',
            icon: <Icon name="edit" />,
            href: '/'
        },
        {
            seperator: true
        },
        {
            title: 'Iconsuz'
        },
        {
            fullComponent: (
                <div style={{ padding: 10, background: '#445', color: '#fff' }}>
                    <p>test Full Component</p>
                </div>
            )
        }
    ];

    const menuList: MenuItem[] = [
        {
            type: 'fullComponent',
            fullComponent: <Button onlyIcon={<Icon iconMui="access_alarm" />} title="Geri" href="/test" />
        },
        {
            type: 'fullComponent',
            fullComponent: <Button onlyIcon={<Icon iconMui="access_alarm" />} title="İleri" />
        },
        {
            type: 'fullComponent',
            fullComponent: <div className="seperator" />
        },

        {
            type: 'menu',
            title: 'Dosya',
            items: [
                {
                    fullComponent: <MenuItemHeader>Yeni Belge Oluştur</MenuItemHeader>
                },
                {
                    type: 'submenu',
                    subMenuPopoverProps: {
                        distance: -5,
                        hover: true
                    },
                    title: 'Yeni Belge',
                    icon: <Icon iconMui="open_in_new" />,
                    rightComponent: <Icon iconMui="chevron_right" fontSize={12} />,
                    items: [
                        { title: 'Boş belge', icon: <Icon iconMui="access_alarm" /> },
                        { title: 'Şablon seç', icon: <Icon iconMui="access_alarm" /> }
                    ]
                },
                {
                    title: 'Boş belge',
                    icon: <Icon iconMui="access_alarm" />,
                    rightComponent: 'CMD+N'
                },
                {
                    title: 'Şablon seç'
                },

                {
                    fullComponent: <MenuItemHeader>Belge Aç</MenuItemHeader>
                },
                {
                    title: 'Cihazdan belge aç',
                    icon: <Icon iconMui="access_alarm" />,
                },
                {
                    title: 'Google Drive ile belge aç',
                    icon: <Icon iconMui="access_alarm" />,
                },
                {
                    title: 'sEditorTools ile belge aç',
                    icon: <Icon iconMui="access_alarm" />,
                },
                { title: 'Yedeklerden belge aç' },
                { seperator: true },
                { title: 'Yazdır', icon: <Icon iconMui="access_alarm" />,}
            ]
        },
        {
            type: 'menu',
            title: 'Düzen',
            menuProps: { style: { borderTopLeftRadius: 0, fontSize: 13, minWidth: 120 } },
            items: [{ title: 'Geri Al' }, { title: 'Yinele' }]
        },
        { type: 'menu', title: 'Görünüm', items: [{ title: 'Yakınlaştır' }, { title: 'Uzaklaştır' }] },
        { type: 'menu', title: 'PDF', items: [{ title: 'Belgeler' }, { title: 'Hakkında' }] },
        { type: 'menu', title: 'Yardım', items: [{ title: 'Belgeler' }, { title: 'Hakkında' }] },
        {
            type: 'fullComponent',
            fullComponent: <Button onlyIcon={<Icon iconMui="open_in_new" fontSize={16} color="#0d49a4" />} title="Geri" href="/test" />,
            title: ''
        }
    ];

    const createMenu = (menu: MenuItem | typeMenu, index: number) => {
        if (menu.type === 'button') {
            return <Button key={index} children={menu.title} href={menu.href} target={menu.target} />;
        } else if (menu.type === 'fullComponent') {
            return <React.Fragment key={index}>{menu.fullComponent}</React.Fragment>;
        } else if (menu.type === 'menu') {
            return (
                <Popover key={index} component={<MainMenu>{menu.title}</MainMenu>} position="bottom-left" distance={0}>
                    <Menu
                        menu={menu.items || []}
                        style={{
                            borderTopLeftRadius: 0,
                            fontSize: 13
                        }}
                        {...(menu.menuProps || {})}
                    />
                </Popover>
            );
        }
    };

    return (
        <Box style={{ margin: 10 }}>
            <BoxHeader>
                <div className="main">{menuList.map((menu, index) => createMenu(menu, index))}</div>

                <br />
                <span>Menu</span>
                <Popover
                    component={
                        <Button buttonClass="primary" buttonSize="small" style={{ float: 'right' }}>
                            Menu
                        </Button>
                    }
                >
                    <Menu menu={menu} withIcon={false} />
                </Popover>
            </BoxHeader>
            <BoxContent>
                <Menu menu={menu} withIcon={true} />
            </BoxContent>
            <BoxFooter>
                <Popover
                    component={
                        <Button buttonClass="primary" buttonSize="small">
                            Menu
                        </Button>
                    }
                >
                    <Menu menu={menu} withIcon={true} />
                </Popover>
            </BoxFooter>
        </Box>
    );
}



const MainMenu = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0px 10px;
    border-radius: 4px;
    user-select: none;
    font-weight: 400;
    font-size: 13px;
    color: #000000;
    cursor: pointer;

    & > span {
        display: inline-flex !important;
        align-items: center !important;
    }

    &:hover,
    &.spopover_active {
        box-shadow: inset 0 0 16px #cad2db;
        text-shadow: 0 0 8px #a8b8c0;
    }

    &.spopover_active {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }
`;

const MenuItemHeader = styled.div.attrs({ className: '' })`
    font-size: 12px;
    font-weight: 600;
    padding: 0px 12px;
    color: #444444;
    height: 25px;
    margin-top: 10px;
`;
