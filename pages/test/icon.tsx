import { Box, BoxContent, BoxFooter, BoxHeader, Icon, iconList } from '@/@base';

import { useEffect } from 'react';
import { customIcons } from '../customIcons';

export default function Test() {
    useEffect(() => {
        // // Tüm materialUI ikonlarını listeleyebiliyorum. cors kullanıyoruz, ilk denemede demo için onay vermek lazım. linki doğrudan aç
        // fetch('https://cors-anywhere.herokuapp.com/https://fonts.google.com/metadata/icons?key=material_symbols&incomplete=true')
        //     .then((res) => res.text()) // Google JSON'u başında )]}'
        //     .then((text) => {
        //         // JSON başında )]}'
        //         const json = JSON.parse(text.replace(/^.*?\n/, ''));
        //         const iconNames = json.icons.map((icon: any) => icon.name);
        //         console.log(iconNames);
        //         console.log(`Toplam ikon sayısı: ${iconNames.length}`);
        //     })
        //     .catch((err) => console.error('Hata:', err));
    }, []);

    return (
        <Box style={{ margin: 10, maxHeight: 300 }}>
            <BoxHeader>IconList</BoxHeader>
            <BoxContent style={{ display: 'flex', flexWrap: 'wrap', gap: 30 }}>
                {iconList.map((item: any, index: number) => (
                    <div key={index} title={item} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Icon name={item} />
                        <b style={{ fontSize: 15, marginTop: 5 }}>{item}</b>
                    </div>
                ))}
                <br />
                Custom ICON = <Icon customIcon={customIcons.logo} fontSize={50} />
                MaterialICON= <Icon iconMui="edit" fontSize={50} color="red" />
                Icon Yok= <Icon name="karşılıksız" />
            </BoxContent>
            <BoxFooter>Footer</BoxFooter>
        </Box>
    );
}
