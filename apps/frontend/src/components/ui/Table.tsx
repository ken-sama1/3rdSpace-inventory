import type { CSSProperties, ReactNode } from "react";

interface TableData {
  [x: string]: unknown;
}

type TableColumnOption<T extends TableData> = {
  [K in keyof T]?: {
    /** Display an alias instead of the field name*/
    as?: string;
    /** Transform the value of the column*/
    value?: ReactNode | ((cellData: T[K]) => ReactNode);
    /** Spicifies the order of the column*/
    index?: number;
    /** Apply cutom style on the column*/
    style?: CSSProperties | ((cellData: T[K]) => CSSProperties);
    colspan?: number;
  };
};

type TableOptions<T extends TableData> = {
  column?: TableColumnOption<T>;
  /** Set table columns. Default 12 */
  columns?: number;
  /** Properties that will be applied on each row*/
  row?: {
    style?: CSSProperties | ((rowData: T) => CSSProperties);
    /** Triggered when a row is clicked and pass row data as argument */
    onClick?: (rowData: T) => void;
  };
  /** Excluded keys will not be displayed on the table */
  exlude?: (keyof T)[];
};

type TableProps<T extends TableData> = {
  data: T[];
  options?: TableOptions<T>;
};

const Table = <T extends TableData>({ data, options = {} }: TableProps<T>) => {
  const { exlude } = options;

  const tableDataOrder = Object.keys(data[0])
    .map((k: keyof T) => {
      if (exlude && exlude.includes(k)) return null;

      return k;
    })
    .filter((e: keyof T | null) => e !== null)
    .sort((a: keyof T, b: keyof T) => {
      const indexA = options.column?.[a]?.index ?? 99;
      const indexB = options.column?.[b]?.index ?? 99;

      return indexA - indexB;
    });

  return (
    <div className="size-full border min-h-[40vh]">
      {data.map((e: any) => {
        return <p key={e.id}>{e.name}</p>;
      })}
    </div>
  );
};

export default Table;
