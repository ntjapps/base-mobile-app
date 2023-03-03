module.exports = {
    plugins: [require("daisyui")],
    content: [
        "src/*.js",
        "src/*.ts",
        "src/*.vue",
        "src/**/*.js",
        "src/**/*.ts",
        "src/**/*.vue",
        "src/**/**/*.js",
        "src/**/**/*.ts",
        "src/**/**/*.vue",
    ],
    darkMode: "class",
};
