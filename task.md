# Checklist for Ground Zero Upgrade

- [x] 1. Database migrations: Update `schema.prisma` and run `npx prisma db push`
- [x] 2. Update database seeding: Default password set to `12345678`
- [x] 3. Fix Authentication loading state buffer in `AuthContext.tsx`
- [x] 4. Implement Password/OTP checking logic in login API route
- [x] 5. Implement signup API password hash saving logic
- [x] 6. Auth page UI upgrades (Add Password field, OTP option modal/fields, signup password fields)
- [x] 7. Add calendar icon visibility in dark mode via CSS in `globals.css`
- [x] 8. Public browsing updates (bypassing auth in `PortalLayout.tsx` for `/discover` and `/festival/[id]`)
- [x] 9. Public-friendly header for anonymous users in `PortalLayout.tsx`
- [x] 10. Add "Discover Network" to Organizer nav links in `PortalLayout.tsx`
- [x] 11. Add contact sponsorship banner to `festival/[id]/page.tsx`
- [x] 12. Add detailed stall metrics, custom schedule lists, and instagram handles to `festival/[id]/page.tsx`
- [x] 13. Upgrade stall layout map visual selection colors in `StallMap.tsx`
- [x] 14. Allow selecting booked/reserved stalls in `StallMap.tsx` to view info
- [x] 15. Create Stall delete API route `/api/stalls/delete`
- [x] 16. Enable Stall deletion on mapping canvas UI
- [x] 17. Add dimensions description and power grid setup to Mapping canvas form
- [x] 18. Local photo upload API route `/api/uploads`
- [x] 19. Create Organizer Edit Festival/Event details page
- [x] 20. Create Update Festival/Event API route `/api/festivals/update`
- [x] 21. Create Admin Mark Paid (Offline) API route `/api/admin/mark-paid`
- [x] 22. Admin Dashboard upgrades (CRM notes, offline payment action, host listing counts)
- [x] 23. Create legal MOU template route `/agreement` (resolving 404)
- [x] 24. Redesign "My Bookings" page for vendors
- [x] 25. Fix two broken Unsplash image URLs on landing page
- [x] 26. Verify build success and verify all fixes

## Phase 2: Live Credentials & Canva-like Blank Drawing Map Canvas System

- [x] 27. **Authentication Improvements**: Enforce strict password checking once password is reset (no default test bypass code `12345678` for customized credentials).
- [x] 28. **Simulated Reset & OTP Login**: Fully wired up simulated password reset verification OTP flow (OTP: `654321`) updating SQLite DB, and simulated login OTP verification flow (OTP: `123456`).
- [x] 29. **WhatsApp Preparation**: Implemented standard `sendWhatsAppMessage` service and mock triggers in `whatsapp.ts` wired directly to booking updates, negotiation proposals, and checkout route handlers.
- [x] 30. **Canva-like Blank Canvas System**: Allowed organizers to design floorplans from scratch on a blank grid map layout if no PDF blueprint is uploaded, and automatically sync visual annotations (stages, walkways, utilities) with vendor floorplan mapping.
- [x] 31. **Fix Layout Mapper JSX Mismatch**: Resolved compiler block by restoring the correct sidebar wrapper markup and verified Next.js app build compilation.
- [x] 32. **Past Events Feedback & Ratings**: Implemented Concluded events feedback forms on Vendor and Organizer dashboards, allowing ratings and comments, automatically refreshing intelligence listings.
- [x] 33. **Production Validation**: Cleaned up seed user assignments and verified standard `npm run build` compilation success.
- [x] 34. **Relocate Yield Estimator**: Relocated the interactive Stall Yield & ROI Estimator widget higher on the landing page (under Past Festivals Registry) and added custom parameters (Conversion, Duration, direct numeric inputs for Footfall, Average Customers/Day, Daily Operational Cost overrides) with fallback empty string handlers (`value || ""`) to support smooth backspaces.
- [x] 35. **Interactive Past Event Stall Map**: Overhauled the concluded events detail modal to replace the text lists with an interactive visual map grid of stalls.
- [x] 36. **DB Seeding Expansion**: Clean-seeded the database to restore exactly 6 festivals (3 active, 3 concluded) and populated 6 stalls with coordinates and audited yield/profit metrics for each past festival.

## Phase 3: Separate Admin Dashboards, Host Stall grid, and session validation

- [x] 37. **Session Validation**: Implement `/api/auth/verify-session` to validate client sessions and update mismatched IDs on database re-seed.
- [x] 38. **Auth Sync Client**: Wire `/api/auth/verify-session` into `AuthContext.tsx` on-mount mount flow.
- [x] 39. **Admin Dashboard route**: Modify `/api/admin/dashboard` to include `organizer` in `publishedFestivals`.
- [x] 40. **Admin Dashboard UI Tabulation**: Split `/dashboard/admin/page.tsx` into **Vendor Management** and **Organizer Management** tabs.
- [x] 41. **Organizer Dashboard Stall Grid**: Update `/dashboard/organizer/page.tsx` and `/dashboard/organizer/festivals/page.tsx` to include collapsible lists of stall statuses.
- [x] 42. **Mapper Navigation Naming**: Rename mapper coordinates links to "Map Creator Canvas" on the organizer dashboards.
- [x] 43. **Discover Tabular Listing**: Add a list/table of all stalls at the bottom of the `/festival/[id]` discover detail page.
- [x] 44. **Validation & Production Build**: Build and verify the application.

## Phase 4: Financial Reports, Booking Restrictions, and Multi-bid Negotiations

- [x] 45. **Restored Unified Admin Dashboard**: Re-merged the tabs back to the unified cards layout for stats tracking.
- [x] 46. **Financial Reports Module**: Built reports engine in admin cockpit for monthly/event-wise Excel-like statements with database backup archiving.
- [x] 47. **Vendor-only Booking Locks**: Enforced restrictions blocking host/admin roles from booking stalls.
- [x] 48. **Multi-bid Negotiations**: Kept booking buttons active to allow multiple bids on a single stall until paid.

## Phase 5: Pitch Decks verification, Lineup revisions approval, and Map Lockouts

- [x] 49. **Pitch Decks Uploader**: Enabled up to 3 deck uploads with ARCHIVED state retention on delete.
- [x] 50. **Discover page approved decks filter**: Filtered discover details to show approved decks only.
- [x] 51. **Lineup Revisions Approval Flow**: Redirected published festival lineup updates to a proposed status, requiring admin approval.
- [x] 52. **Layout Canvas & Price Lockouts**: Disabled map drawings, dimensions forms, average prices, and blueprints uploaders when a map is locked.
- [x] 53. **Production Validation**: Confirmed that Next.js compilation succeeds with no TypeScript type errors.
