"use client";
import { Suspense} from "react";
import Track from "../components/Track";

export default function TrackPage() {

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Track />
    </Suspense>
);
}