# SSH Kurulumları

#### 1-Öncelikle bilgisayar için bir ssh key oluşturacağız. Kaynak: https://devqa.io/install-git-mac-generate-ssh-keys/

Mac için:
> brew install git
> git --version
> cd ~/
> ssh-keygen -t rsa //Enter enter yapıp geçiyoruz
> pbcopy < ~/.ssh/id_rsa.pub // Direkt keyi kopyalıyor.

Windows için:
https://inchoo.net/dev-talk/how-to-generate-ssh-keys-for-git-authorization/

SSH kodunu alıp github hesabına ekliyoruz.
https://linuxhint.com/clone-repo-with-ssh-key-in-git/

#### 2-Netlify kurulumu.

Netlify'de site deploy ayarlarına girip deploy key oluşturuyoruz.
Onu da Github hesabına ekliyoruz.

## Submodule eklemek için

> git submodule add -b main git@github.com:izzetseydaoglu/_slib_reactts.git

> Daha sonra Phpstorm'da Preferences | Version Control | Directory Mappings gidip VCS'ye onu da ekliyoruz.
> Git - branches menüsünden de branchi main olarak değiştiriyoruz.

## Bağlamak istediğiniz projenin terminaline şunu yazıyoruz.

#Bu kod submodulleri de otomatik günceller diyor.
git config --global submodule.recurse true

## Submodule silmek için

> git submodule deinit -f _slib_reactts && rm -rf .git/modules/_slib_reactts && git rm -f _slib_reactts

## Parent Repo'nun Submodulesini Güncelleme

> package.json'a bunu ekle.

"gitPullSubModules": "git submodule update --remote",
"gitSubModuleGuncelleOnGithub": "git submodule update --remote && git add . && git commit -m \"Submodule güncellendi\" && git push origin HEAD:main",
"gitPushSubModules": "git submodule foreach 'git status && git add . && git commit -a -m . && git push origin HEAD:main' && git commit -a -m . && git push origin HEAD:main",

Not: Değişiklik yoksa error verir, önemli değil.

https://lib.yemreak.com/proje-yonetimi/git/submodule
burda güzel bir örnek var



---





