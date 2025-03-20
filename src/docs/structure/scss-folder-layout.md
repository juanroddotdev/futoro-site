# SCSS Folder Structure

This document outlines the organization of our SCSS files.

## Folder Structure

```
src/
└── scss/
    ├── abstracts/
    │   ├── _variables.scss    (variables, colors, config)
    │   ├── _functions.scss    (Sass functions)
    │   └── _mixins.scss      (Sass mixins)
    │
    ├── base/
    │   ├── _reset.scss       (reset/normalize)
    │   ├── _typography.scss  (typography rules)
    │   └── _animations.scss  (animations)
    │
    ├── components/
    │   ├── _buttons.scss     (buttons)
    │   ├── _cards.scss      (cards)
    │   └── _forms.scss      (forms)
    │
    ├── layout/
    │   ├── _header.scss     (header)
    │   ├── _footer.scss     (footer)
    │   ├── _navigation.scss (navigation)
    │   └── _grid.scss       (grid system)
    │
    ├── pages/
    │   ├── _home.scss       (home specific styles)
    │   ├── _about.scss      (about specific styles)
    │   └── _contact.scss    (contact specific styles)
    │
    ├── themes/
    │   ├── _dark.scss       (dark theme)
    │   └── _admin.scss      (admin theme variations)
    │
    ├── vendors/
    │   └── _tailwind.scss   (third-party styles)
    │
    └── main.scss            (main file that imports all other files)
```

## Naming Conventions

- Partial files begin with an underscore (`_`)
- Component files should be named after the component they style
- Use kebab-case for file names

## Import Order

In `main.scss`, imports should follow this order:

1. Abstracts (variables, functions, mixins)
2. Vendors (third-party libraries)
3. Base styles (reset, typography, animations)
4. Layout components (grid, header, footer)
5. UI components (buttons, forms, cards)
6. Page-specific styles
7. Themes

## Best Practices

1. Keep files small and focused on a single responsibility
2. Use variables from `_variables.scss` instead of hardcoding values
3. Use mixins for repeated code patterns
4. Comment complex selectors or calculations
5. Group related styles together