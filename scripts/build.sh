rm -rf dist
rm -rf build
yarn build

mkdir build
cp -rp CSXS dist build

scripts/ZXPSignCmd.exe -sign build build/voDrame.zxp scripts/cert.p12 asd123
