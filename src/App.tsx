import { ClaimModal } from "./components/ClaimModal";
import { ConflictModal } from "./components/ConflictModal";
import { CreateRequestModal } from "./components/CreateRequestModal";
import { DemoBanner } from "./components/DemoBanner";
import { Header } from "./components/Header";
import { ListFiltersBar } from "./components/ListFilters";
import { LockedRequestModal } from "./components/LockedRequestModal";
import { RequestDrawer } from "./components/RequestDrawer";
import { RequestsBoard } from "./components/RequestsBoard";
import { RequestsTable } from "./components/RequestsTable";
import { RightsHintModal } from "./components/RightsHintModal";
import { Toast } from "./components/Toast";
import { ViewToggle } from "./components/ViewToggle";
import { useAssignmentApp } from "./hooks/useAssignmentApp";
import styles from "./App.module.css";

export function App() {
  const app = useAssignmentApp();
  const selected = app.selectedRequest;

  return (
    <div className={styles.shell}>
      <Header
        onReset={app.reset}
        onConflict={app.simulateConflict}
        onNoCrews={app.simulateNoCrews}
        onRightsHint={app.showRightsHint}
      />
      <DemoBanner scenario={app.demoScenario} onReset={app.reset} />
      <main className={styles.main}>
        <div className={styles.titleRow}>
          <div>
            <h1>Заявки на выезд</h1>
            <p>
              Полуавтоматическое назначение бригады. Решение подтверждает
              диспетчер.
            </p>
          </div>
          <ViewToggle value={app.viewMode} onChange={app.setViewMode} />
        </div>
        {app.viewMode === "list" ? (
          <ListFiltersBar
            value={app.listFilters}
            requests={app.requests}
            onChange={app.setListFilters}
          />
        ) : null}
        {app.viewMode === "board" ? (
          <RequestsBoard
            requests={app.boardRequests}
            crews={app.crews}
            selectedRequestId={app.selectedRequestId}
            inProgressScope={app.inProgressScope}
            onInProgressScopeChange={app.setInProgressScope}
            onOpen={app.openRequest}
            onCreate={() => app.setCreateOpen(true)}
          />
        ) : (
          <RequestsTable
            requests={app.listRequests}
            crews={app.crews}
            selectedRequestId={app.selectedRequestId}
            onOpen={app.openRequest}
          />
        )}
      </main>
      {selected ? (
        <RequestDrawer
          request={selected}
          crews={app.crews}
          history={app.history[selected.id] ?? []}
          role={app.role}
          forceNoCrews={app.forceNoCrews}
          onClose={app.closeDrawer}
          onDenied={app.denyPermission}
          onAssign={app.assignCrew}
          onRecordRecommendation={(crewName) =>
            app.recordRecommendation(selected.id, crewName)
          }
          onAddComment={(text) => app.addComment(selected.id, text)}
        />
      ) : null}
      {app.createOpen ? (
        <CreateRequestModal
          requests={app.requests}
          crews={app.crews}
          onCreate={app.createRequest}
          onContinueExisting={app.continueExisting}
          onClose={() => app.setCreateOpen(false)}
        />
      ) : null}
      {app.pendingClaimRequest ? (
        <ClaimModal
          requestId={app.pendingClaimRequest.id}
          onAccept={app.acceptClaim}
          onOpenOnly={app.openWithoutClaim}
          onDecline={app.declineClaim}
        />
      ) : null}
      {app.lockedOpen ? (
        <LockedRequestModal onClose={app.closeLocked} />
      ) : null}
      {app.rightsHintOpen ? (
        <RightsHintModal onClose={app.closeRightsHint} />
      ) : null}
      {app.conflict ? (
        <ConflictModal
          conflict={app.conflict}
          onRefresh={app.resolveConflict}
        />
      ) : null}
      {app.toast ? (
        <Toast message={app.toast.message} onDismiss={app.dismissToast} />
      ) : null}
    </div>
  );
}
