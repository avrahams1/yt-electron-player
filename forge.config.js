module.exports = {
    makers: [
        {
            name: '@electron-forge/maker-dmg',
            config: {
                background: './assets/dmg-background.png',
                format: 'ULFO'
            }
        },
        {
            name: '@electron-forge/maker-wix',
            config: {
                language: 1033,
                manufacturer: 'My Awesome Company'
            }
        }
    ],
    plugins: [
        [
            "@electron-forge/plugin-webpack",
            {
                mainConfig: "./webpack.main.config.js",
                renderer: {
                    config: "./webpack.renderer.config.js",
                    entryPoints: [
                        {
                            html: "./src/index.html",
                            js: "./src/renderer.ts",
                            name: "main_window"
                        }
                    ]
                }
            }
        ]
    ]
}