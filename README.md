# React Data Table

A powerful, flexible, and animated data table implementation built with React 19, Vite, TanStack Table, and Tailwind CSS v4 still on active development.

## Credits

- [Tanstack Table](https://github.com/TanStack/table) by Tanstack
- [TableCN](https://github.com/sadmann7/tablecn) by [sadmann7](https://github.com/sadmann7)
- [Animate UI](https://animate-ui.com/) by [imskyleen](https://github.com/imskyleen)

## 🚀 Features

- **Advanced Data Table**: built on top of `@tanstack/react-table` for headless UI flexibility.
- **Sorting & Filtering**: Built-in support for column sorting and advanced filtering.
- **Pagination**: Efficient data pagination handling.
- **Custom UI Components**: specific components for data table interactions.
- **Animations**: Smooth UI transitions using `motion` and custom `animate-ui` components.
- **Drag & Drop**: Integration with `@dnd-kit` for drag-and-drop interactions.
- **Modern Styling**: Styled with Tailwind CSS v4 and Shadcn UI components.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Library**: [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
- **Table Logic**: [TanStack Table](https://tanstack.com/table/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks & Custom Context
- **Validation**: [Zod](https://zod.dev/) (inferred from usage)
- **Date Handling**: [date-fns](https://date-fns.org/)

## 🏁 Getting Started

### Prerequisites

Ensure you have Node.js installed. This project is optimized for [Bun](https://bun.sh/) but works with npm/yarn/pnpm.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sahilverma-dev/advanced-react-data-table
   cd advanced-react-data-table
   ```

2. Install dependencies:

   ```bash
   bun install
   # or
   npm install
   ```

### Development

Start the development server:

```bash
bun dev
# or
npm run dev
```

The app will run at `http://localhost:3000` (default).

### Building for Production

Build the project for production:

```bash
bun build
# or
npm run build
```

Preview the production build:

```bash
bun preview
# or
npm run preview
```

## 📂 Project Structure

```txt
src/
├── app/               # Main application pages and logic
├── components/        # Reusable UI components
│   ├── data-table/    # Core data table components
│   ├── animate-ui/    # Custom animated components
│   ├── ui/            # Shadcn UI primitives
│   └── providers/     # Global providers (Theme, etc.)
├── hooks/             # Custom React hooks (including use-data-table)
├── lib/               # Utilities and helper functions
├── assets/            # Static assets
└── index.css          # Global styles (Tailwind)
```

## 📄 License

I don't have any just use it. 🫡
