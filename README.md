# CodeSnapX

A modern code snippet sharing platform with a sleek dark blue UI. Share your code snippets easily without requiring login.

![CodeSnapX Preview](https://via.placeholder.com/1200x630?text=CodeSnapX+Preview)

## Features

- 🚀 **Modern UI** - Sleek dark-theme interface with interactive elements
- 📝 **Code Sharing** - Share code snippets with syntax highlighting
- 🔍 **Explore** - Discover snippets shared by others
- 👁️ **View Count** - Track how many times your snippets have been viewed
- ❤️ **Like System** - Like snippets you find useful
- 📋 **Copy/Raw** - Copy code with one click or view in raw format
- 🌙 **Dark Theme** - Easy on the eyes with a modern dark blue theme
- 📱 **Responsive** - Works on all devices
- 🔒 **No Login Required** - Share code without creating an account

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, Framer Motion
- **Database**: Supabase
- **Deployment**: Vercel
- **Syntax Highlighting**: react-syntax-highlighter

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- A Supabase account (free tier works fine)

### Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/codesnap-x.git
cd codesnap-x
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up Supabase**

   - Create a new project on [Supabase](https://supabase.com)
   - Create the following tables in your Supabase database:

   **snippets**
   ```sql
   create table snippets (
     id text primary key,
     title text not null,
     content text not null,
     language text,
     description text,
     user_id text,
     author text,
     is_verified boolean default false,
     is_private boolean default false,
     views_count integer default 0,
     likes_count integer default 0,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now())
   );
   ```

   **snippet_views**
   ```sql
   create table snippet_views (
     id uuid primary key default uuid_generate_v4(),
     snippet_id text references snippets(id) on delete cascade,
     view_key text not null,
     ip_address text,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   ```

   **snippet_likes**
   ```sql
   create table snippet_likes (
     id uuid primary key default uuid_generate_v4(),
     snippet_id text references snippets(id) on delete cascade,
     user_id text not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   ```

   **admins**
   ```sql
   create table admins (
     id uuid primary key default uuid_generate_v4(),
     username text unique not null,
     password_hash text not null,
     display_name text not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   ```

   **Create functions for view/like count**
   ```sql
   -- Function to increment view count
   create or replace function increment_view_count(snippet_id text)
   returns int as $$
   declare
     new_count int;
   begin
     update snippets
     set views_count = views_count + 1
     where id = snippet_id
     returning views_count into new_count;
     
     return new_count;
   end;
   $$ language plpgsql;

   -- Function to increment like count
   create or replace function increment_like_count(snippet_id text)
   returns int as $$
   declare
     new_count int;
   begin
     update snippets
     set likes_count = likes_count + 1
     where id = snippet_id
     returning likes_count into new_count;
     
     return new_count;
   end;
   $$ language plpgsql;

   -- Function to decrement like count
   create or replace function decrement_like_count(snippet_id text)
   returns int as $$
   declare
     new_count int;
   begin
     update snippets
     set likes_count = greatest(0, likes_count - 1)
     where id = snippet_id
     returning likes_count into new_count;
     
     return new_count;
   end;
   $$ language plpgsql;
   ```

4. **Configure environment variables**

   Create a `.env.local` file in the root directory:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Visit the app**

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy on Vercel

The easiest way to deploy your CodeSnapX app is to use [Vercel](https://vercel.com):

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Add your environment variables in the Vercel project settings
4. Deploy!

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.