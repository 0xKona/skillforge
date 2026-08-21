frontend/src/components/
├── common/                 # Shared, domain-agnostic components
│   ├── icons/              # SVG icons
│   ├── ui/                 # Shadcn & Base UI primitives (Button, Input, Typography)
│   ├── effects/            # Animations (FireEmbers, etc.)
│   └── widgets/            # Reusable complex UI (BackButton, RefreshButton, LibraryCard)
│
├── layout/                 # Global layout components
│   ├── footer/
│   ├── navigation/         # Navbar, NavItems, MobileMenu
│   └── wrappers/           # PageWrapper, SectionWrapper
│
├── features/               # Business logic grouped by domain
│   ├── auth/               # (was auth-form)
│   ├── anvil/              # Ingot management, Editors, Filters
│   ├── forge/              # (was cv-interface) CV Editor, Library, Validation
│   ├── profile/            # Avatar editor, account settings
│   └── pdf/                # (was pdf-preview) PDF generation logic
│
├── sections/               # Page-specific content blocks (Marketing)
│   ├── home/               # Hero, CTA, Features
│   └── about/              # Hero, HowItWorks
│
└── providers/              # Context providers (Theme, Auth)
