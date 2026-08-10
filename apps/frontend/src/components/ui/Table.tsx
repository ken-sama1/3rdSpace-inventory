import type { CSSProperties, ReactNode } from "react";

type TableData = Record<string, any>;

export type TableColumnOption<T extends TableData> = {
  [K in keyof T]?: {
    /** Display an alias instead of the field name*/
    as?: string;
    /** Transform the value of the column*/
    value?: ReactNode | ((cellData: T[K]) => ReactNode);
    /** Spicifies the order of the column*/
    index?: number;
    /**
     * Apply cutom style on the column.
     * Will overwrite style property defined in `row`
     * */
    style?: CSSProperties | ((cellData: T[K]) => CSSProperties);
    colspan?: number;
  };
};

export type TableOptions<T extends TableData> = {
  column?: TableColumnOption<T>;
  /** Set table columns. Default 12 */
  columns?: number;
  /** Properties that will be apply to every cell*/
  cell?: {
    style?: CSSProperties | ((cellData: T[keyof T]) => CSSProperties);
  };
  /** Properties that will be applied on each row*/
  row?: {
    style?: CSSProperties | ((rowData: T) => CSSProperties);
    /** Triggered when a row is clicked and pass row data as argument */
    onClick?: (rowData: T) => void;
  };
  /** Excluded keys will not be displayed on the table */
  exlude?: (keyof T)[];
};

export type TableProps<T extends TableData> = {
  data: T[];
  className?: string;
  options?: TableOptions<T>;
};

const Table = <T extends TableData>({ data, options = {} }: TableProps<T>) => {
  const { exlude, columns = 12, row = {} } = options;

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
    <div className="min-h-[40vh] h-full w-full overflow-hidden">
      {/* Table Header */}
      <div
        className="grid place-items-center w-full h-10 bg-(--primary) border-b-3 border-(--line) shadow-xs"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {tableDataOrder.map((d, idx) => {
          const colspan = options.column?.[d]?.colspan ?? 1;
          return (
            <div
              className="size-full flex items-center"
              key={`${String(d)}-${idx}`}
              style={{
                gridColumn: `span ${colspan} / span ${colspan}`,
              }}
            >
              <span className="size-full flex items-center justify-start uppercase font-bold text-sm!">
                {String(d)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Table Body */}
      <div className="w-full h-[calc(100%-40px)] py-1 overflow-auto no-scrollbar bg-(--primary)">
        {data.map((rowData, idx) => {
          const rowKey = `row-data-${idx}`;
          const rowStyle = row?.style
            ? typeof row.style === "function"
              ? row.style(rowData)
              : row.style
            : {};

          /** Table Row*/
          return (
            <button
              onClick={() => {
                if (row?.onClick) {
                  row.onClick(rowData);
                }
              }}
              key={rowKey}
              className="h-10 w-full border-b border-(--line) nice-hover"
              style={{
                ...rowStyle,
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }}
            >
              {tableDataOrder.map((k) => {
                const cell = options.column?.[k];
                const colspan = cell?.colspan ?? 1;
                const cellData = rowData?.[k];
                const cellStyle = cell?.style
                  ? typeof cell.style === "function"
                    ? cell.style(cellData)
                    : cell.style
                  : {};

                /* Table Cell  */
                return (
                  <div
                    key={`cell-data-${idx}-${String(k)}`}
                    className="w-full size-full flex"
                    style={{
                      gridColumn: `span ${colspan} / span ${colspan}`,
                    }}
                  >
                    <span
                      className="size-full"
                      style={{
                        ...cellStyle,
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      {String(cellData)}
                    </span>
                  </div>
                );
              })}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Table;
