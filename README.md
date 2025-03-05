## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

This is task from company https://lytvynov-production.com/
Requirements https://docs.google.com/document/d/1dXIq5JckbzG6H0ItI1xZ0gvbo5chiBUM5BA48JSzigw/edit?tab=t.0
Project stack and technology: Next.js,TypeScript,React Query, TailwindCSS, Formik, Yuo
Fake api: https://fakestoreapi.com/

Based on module architecture. 

According to the specifications, it is necessary to show the order statuses for https://fakestoreapi.com/docs#tag/Carts/operation/getAllCarts that are missing in these fields, 
I decided to assign these requests randomly with each endpoint call to implement some points from the specifications.

This fake API also allows me to only send a new field such as order, but it is not written to the database, so it is not updated.