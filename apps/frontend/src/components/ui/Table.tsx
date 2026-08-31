import type { CSSProperties, ReactElement, ReactNode } from "react";

type TableData = Record<string, any>;

export type TableCustomColumn = {
  /** Column Headet */
  as: string;
  /** Column Value*/
  value: ReactNode;
  style?: CSSProperties;
  colspan?: number;
};

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
     * Will overwrite styles defined in `row`
     * */
    style?: CSSProperties | ((cellData: T[K]) => CSSProperties);
    colspan?: number;
  };
};

export type TableOptions<T extends TableData> = {
  /** Properties that will be applied on the table head*/
  head?: {
    style?: CSSProperties;
  };
  column?: TableColumnOption<T>;
  /** Set table columns. Default 12 */
  columns?: number;
  /** Properties that will be apply to every cell */
  cell?: {
    style?: CSSProperties | ((cellData: T[keyof T]) => CSSProperties);
  };
  /** Properties that will be applied on each row*/
  row?: {
    style?: CSSProperties | ((rowData: T) => CSSProperties);
    /** Triggered when a row is clicked and pass row data as argument */
    onClick?: (rowData: T) => void;
    /** Add  Add this element on every row*/
    element?: ReactElement | ((rowData: T) => ReactElement);
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
  const { exlude, columns = 12, row = {}, head } = options;

  const tableDataOrder = [...Object.keys(data[0])]
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
          const alias = options.column?.[d]?.as ?? d;
          const headStyle = head?.style ?? {};
          return (
            <div
              className="size-full flex items-center"
              key={`${String(d)}-${idx}`}
              style={{
                ...headStyle,
                gridColumn: `span ${colspan} / span ${colspan}`,
              }}
            >
              <span className="h-full flex items-center uppercase font-bold text-sm tracking-wider text-inherit!">
                {String(alias)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Table Body */}
      <div className="w-full h-[calc(100%-40px)] py-1 overflow-auto no-scrollbar bg-(--primary)">
        {data.map((rowData, idx) => {
          const element =
            typeof row.element === "function"
              ? row.element(rowData)
              : row.element;
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
              className="h-10 w-full items-center relative border-b border-(--line) nice-hover"
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
                const cellValue = cell?.value
                  ? typeof cell.value === "function"
                    ? cell.value(cellData)
                    : cell.value
                  : null;
                const cellStyle = cell?.style
                  ? typeof cell.style === "function"
                    ? cell.style(cellData)
                    : cell.style
                  : {};

                /* Table Cell  */
                return (
                  <div
                    className="w-fit"
                    key={`cell-data-${idx}-${String(k)}`}
                    style={{
                      gridColumn: `span ${colspan} / span ${colspan}`,
                    }}
                  >
                    <span
                      style={{
                        ...cellStyle,
                        alignItems: "center",
                        display: "flex",
                      }}
                      className="text-sm"
                    >
                      {cellValue ? cellValue : String(cellData)}
                    </span>
                  </div>
                );
              })}

              {element && element}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Table;
