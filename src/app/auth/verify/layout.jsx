'use client';

import { CompactLayout } from "src/layouts/compact";

import { GuestGuard } from "src/auth/guard";



// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <GuestGuard>
      <CompactLayout>{children}</CompactLayout>;
    </GuestGuard>
  );
}