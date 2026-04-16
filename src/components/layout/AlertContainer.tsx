import { useAlerts } from "@/context/AlertContext";
import { Alert } from "@/components/ui/Alert";

export function AlertContainer() {
  const { alerts, removeAlert } = useAlerts();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed right-4 top-4 z-50 flex w-80 flex-col gap-2">
      {alerts.map((alert) => (
        <Alert key={alert.id} alert={alert} onDismiss={removeAlert} />
      ))}
    </div>
  );
}
