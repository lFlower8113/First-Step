import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "First Step | 空间解忧新手通关向导",
  description:
    "Every journey begins with the first step. 凡未至之处，皆有迹可循。消除因第一次去陌生场所而产生的社交与动线焦虑，沉浸式 3D 空间漫游与真人随手小抄向导。",
  keywords: [
    "First Step",
    "社交焦虑",
    "星巴克第一次点单",
    "医院挂号指南",
    "机场登机避坑",
    "3D向导",
    "Web 3D",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="antialiased bg-neutral-950 text-white selection:bg-emerald-500/30">
        {children}
      </body>
    </html>
  );
}
