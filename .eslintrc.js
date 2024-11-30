module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
        "jest": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "rules": {
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "no-unused-vars": ["warn"],
        "no-console": ["warn", { "allow": ["warn", "error"] }],
        "curly": ["error", "all"],
        "eqeqeq": ["error", "always"],
        "no-multi-spaces": ["error"],
        "no-multiple-empty-lines": ["error", { "max": 2 }],
        "no-trailing-spaces": ["error"],
        "space-before-blocks": ["error", "always"],
        "space-before-function-paren": ["error", "never"],
        "space-in-parens": ["error", "never"],
        "space-infix-ops": ["error"],
        "spaced-comment": ["error", "always"]
    }
};
