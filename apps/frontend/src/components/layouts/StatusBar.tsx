import { AlertTriangle, /* Banknote,*/ Boxes, PackageX } from "lucide-react";

const StatusBar = () => {
  return (
    // Footer Container
    <footer className="w-full border-t-(--line) border h-12 z-10 fixed bottom-0">
      {/* Wrapper */}
      <div className="size-full bg-(--primary) flex justify-between items-center px-5">
        {/* Left Side Section */}
        <div className="h-6 flex justify-center items-center">
          {/* Total Items */}
          <div className="h-full w-auto flex items-center justify-center gap-1">
            <Boxes className="stroke-1 h-full" />
            <span className="text-xs! flex items-center">Total Items:</span>
            <strong className="text-xs! font-bold">200</strong>
          </div>
          {/* Total Items End */}
        </div>
        {/* Left Side Section End */}

        {/* Right Side Section */}
        <div className="h-6 flex justify-center items-center gap-1.5">
          {/* Low Stock */}
          <div
            className="
            w-auto h-full flex items-center justify-center gap-1.5 px-1.5 py-0.5 rounded-md
            border border-(--line-warning) bg-(--bg-warning) stroke-(--text-warning) text-(--text-warning)!"
          >
            <AlertTriangle className="stroke-2 stroke-inherit! h-full" />
            <span className="text-xs! text-inherit! flex items-center">
              Low Stock:
            </span>
            <strong className="text-xs! font-bold text-inherit!">2</strong>
          </div>
          {/* Low Stock End */}

          {/* Out of Stock */}
          <div
            className="
            w-auto h-full flex items-center justify-center gap-1.5 px-1.5 py-0.5 rounded-md
            border border-(--line-alert) bg-(--bg-alert) stroke-(--text-alert) text-(--text-alert)!"
          >
            <PackageX className="stroke-2 stroke-inherit! h-full" />
            <span className="text-xs! text-inherit! flex items-center">
              Out of Stock:
            </span>
            <strong className="text-xs! font-bold text-inherit!">3</strong>
          </div>
          {/* Out of Stock End */}

          {/* Total Valuation */}
          {/* <div */}
          {/*   className=" */}
          {/*   w-auto h-full flex items-center justify-center gap-1.5 px-1.5 py-0.5 rounded-md */}
          {/*   border border-(--line-healthy) bg-(--bg-healthy) stroke-(--text-healthy) text-(--text-heathy)!" */}
          {/* > */}
          {/*   <Banknote className="stroke-2 stroke-inherit! size-4.5" /> */}
          {/*   <span className="text-xs! text-inherit!">Revenue:</span> */}
          {/*   <strong className="text-xs! font-bold text-inherit!">6700</strong> */}
          {/* </div> */}
          {/* Total Valuation End*/}
        </div>
        {/* Right Side Section End  */}
      </div>
      {/* Wrapper End */}
    </footer>
    // Footer End
  );
};

export default StatusBar;
