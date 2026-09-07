import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  emptyMessage?: string;
  children: ReactNode;
};

export function Section({ title, emptyMessage, children }: SectionProps) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-black tracking-normal text-zinc-950">{title}</h2>
      </div>
      {hasChildren ? (
        <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {children}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-5 py-10 text-center text-sm font-semibold text-zinc-500">
          {emptyMessage ?? "아직 등록된 프롬프트가 없습니다."}
        </div>
      )}
    </section>
  );
}
