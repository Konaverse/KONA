import Approach1Snap from "@/components/scrollytelling/tests/Approach1Snap";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Prototype: Approach 1",
    description: "Scrollytelling testing environment — Snap to Section",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Approach1TestPage() {
    return (
        <main className="relative bg-[#0a0b09]">
            <Approach1Snap />
        </main>
    );
}
