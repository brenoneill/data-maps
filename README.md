# data-maps

## Deployed at
https://data-maps.vercel.app/

## If you want to run - see bottom

# Requested Information

## Time
Just under 4 hours. 45 minutes of planning. A little over 3 hours of dev work

## Assumptions
- User is accessing on desktop and has a reasonably sized monitor (I didn't build for small or excessively large screens given time constraints)

- User is somewhat familiar with the platform (I didn't have built in tooltips, hints etc)

- User is not a very technical person and appreciates simplicity and clear information

- User is generally accessing to get specific information to share with stakeholders or to add to reports and their main goal is to find the answers they want while requiring a minimal cognitive load (for this reason I made the dependency lines optional in the preferenes slideout, they are informative but I don't assume they are required for most use cases and I added very basic "Share" functionality)

- Identifiable data will be requested more; and is more important than Unindentifiable data (Even though all the provided data is identifiable, I thought it important to add it into the filters as I assume it will form a significant number of request e.g. Get me all identifiable data collected by our database)

## Tradeoffs

- URL driven vs App State vs Local Storage: I ultimately went with URL driven for the filters because ultimately I think there is the most value in enabling the user to share a direct link to a filter state, rather than local storage where they would have the benefit of returning to where they last picked up, I didn't see value for this excercise in a hybrid approach for that. For the user's preference selections, I went wit

- Swimlanes vs Canvas/Placement: I was in two minds whether to go with swimlanes or more of a Canvas like Miro. The Canvas would work really well for the dependencies but ultimately I felt that retrieval of lists would be more important than understnading the relationships at a quick glance - for this reason I also include a 'List' view and 'No Groupings' because it may be a preference for user's trying to access information in a way as familiar as possible.

- Features vs Tests: I added basic Cypress Component Tests for key components. I would have liked to have spent more time on the test suite; I would've added e2e tests also, but I felt it would be better to spend time on features and UX, rather than lots of tests.

- App-wide context for Alerts: I setup app-wide context for alerts, I did this at the very start, I initially thought there would be more need for alerts/toasts - however, I only needed it in one place, this may have been overkill for only one use, but I still think it's good to have the setup as it's such a staple in any app

- Dense Component Structure: I created a somewhat dense folder structure for a small project. I like to keep code separated, I also generally like to use helper components for files with very hefty blocks of HTML as I think components really help with readability but can obviously cause scalability issues wif they introduce excessive prop drilling.

## Special Featurs

- Dependency Graphs: I added in the functionality to connect the dependencies and to create a clear link between systems. As this looks nice, and gives good clear information, it can be hard to get a full picture, so I broke it down to dependencies and dependents and I added graphs into the Sidebar which give a really clear understanding of the system. Given more time it is something I would build out, I was hoping to get multi-level into the graph but I didn't have time.

- Natural Language Search: I added natural language query as an option because I think it will reduce the cognitive load for some users. In particiular, this was representing a modern shift towards natural language requests (AI). I was trying to decide whether to use this sentence builder or actually connect something to Claude API using the ai-sdk but ultimately for the purpose of the excercise I thought it best not to connect to outside providers

- Fides 'Integration': I added in the preference for a user to filter using the 'Fideslang' structure. I think with a bigger dataset this would be very helpful and found the structure really helpful. Using this structure I was also able to enable the user to filter vased on 'identifiable' data (even though all the data in this was idenitifiable)

## AOB and Feedback
I'm not too happy with the clear button, I would have liked to tidy that up a bit, it's in a different position for filters and query, I also would probably repoisition the 'Hide Filters' button - however, I was very close to the 4 hours so decided to go with it as is. The label showing when filters are hidden is a little jumpy, so that's also something I'd like to address along with some general tinkering of animations.

I actually enjoyed the excercise, there was a lot of ways to go and I think it was well structured.

# Get up and running in local

React dashboard for exploring and filtering systems data (Vite + TypeScript + Tailwind).

## Prerequisites

- **Node.js**: Use a current **LTS** release (for example 20.x). This repo does not pin a Node version.
- **npm**: `package-lock.json` is checked in, so **npm** is the intended package manager.

## Get running

```bash
cd data-maps
npm install
npm run dev
```

Vite prints a local URL in the terminal (often `http://localhost:5173`). Open it in your browser.

For a clean install from the lockfile (for example right after cloning), you can use:

```bash
npm ci
```

## Scripts

| Command           | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the Vite dev server                |
| `npm run build`   | Typecheck (`tsc`) and production build   |
| `npm run preview` | Serve the production build locally       |
| `npm run lint`    | ESLint for `.ts` / `.tsx`                |
| `npm run cy:open` | Cypress component tests (interactive UI) |
| `npm run cy:run`  | Cypress component tests (headless)     |


## For React developers

- **Entry**: `src/main.tsx` (root render, app-wide providers including URL/query state via `nuqs`).
- **App**: `src/App.tsx` wraps the main layout and dashboard.
- **Imports**: `@/` maps to `src/` (see `vite.config.ts`).

Stack highlights: React 18, TypeScript, Vite, Tailwind CSS v4.




