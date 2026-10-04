const NotificationsSettings = () => {
  return (
    <section className="max-w-2xl rounded-md border border-(--line) p-4">
      <h4 className="text-base!">Notifications</h4>
      <p className="mt-1 text-xs! text-(--text-muted)!">
        Notification preferences will be connected to the notification center
        when alerts are added.
      </p>
      <div className="mt-5 flex items-center justify-between rounded-md border border-(--line) p-3">
        <div>
          <p className="text-sm!">Low stock alerts</p>
          <p className="text-xs! text-(--text-muted)!">
            Show low-stock indicators throughout the workspace.
          </p>
        </div>
        <span className="status-success rounded-md border text-xs!">
          Enabled
        </span>
      </div>
    </section>
  );
};

export default NotificationsSettings;
