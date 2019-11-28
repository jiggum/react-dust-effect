module.exports = {
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier'],
  globals: {
    window: true,
  },
  rules: {
    'prettier/prettier': 2,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-filename-extension': [
      2,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'no-param-reassign': 0,
    semi: [2, 'never'],
  },
}
