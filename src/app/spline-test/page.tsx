"use client";

import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
    ssr: false,
    loading: () => <div style={{ width: "100%", height: "100vh", background: "#0a0a0a" }} />,
});

export default function SplineTestPage() {
    return (
        <div style={{ width: "100%", height: "100vh", background: "#0a0a0a" }}>
            <Spline
                scene="https://prod.spline.design/O0Tmhaxl-NFS9DJl/scene.splinecode"
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
}
