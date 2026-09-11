import { useEffect, useMemo, useRef, useState } from "react";
import { findAddressMatches } from "../lib/filters";
import {
  requestStatusLabel,
  requestStatusTone,
  requestTypeLabel,
} from "../lib/labels";
import type { CreateRequestDraft, Crew, Request, RequestType } from "../types";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import styles from "./CreateRequestModal.module.css";

interface CreateRequestModalProps {
  requests: Request[];
  crews: Crew[];
  onCreate: (draft: CreateRequestDraft) => void;
  onContinueExisting: (requestId: number) => void;
  onClose: () => void;
}

const WORK_TYPES = ["Промывка", "Телеинспекция"];
const SOURCES = [
  "Управляющая компания",
  "Диспетчерская",
  "Аварийная служба",
  "Договор обслуживания",
];

export function CreateRequestModal({
  requests,
  crews,
  onCreate,
  onContinueExisting,
  onClose,
}: CreateRequestModalProps) {
  const addressRef = useRef<HTMLInputElement>(null);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<RequestType>("emergency");
  const [workType, setWorkType] = useState(WORK_TYPES[0]);
  const [source, setSource] = useState(SOURCES[0]);
  const [previewId, setPreviewId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const matches = useMemo(
    () => findAddressMatches(address, requests),
    [address, requests],
  );
  const preview = requests.find((item) => item.id === previewId);
  const previewCrew = crews.find((crew) => crew.id === preview?.assignedCrewId);
  const canCreate = address.trim().length > 0;

  const draft = (): CreateRequestDraft => ({
    address: address.trim(),
    type,
    workType,
    source,
    description,
  });

  const tryCreate = () => {
    if (!canCreate) {
      return;
    }
    if (matches.length > 0) {
      setPreviewId(null);
      setConfirmOpen(true);
      return;
    }
    onCreate(draft());
  };

  useEffect(() => {
    addressRef.current?.focus();
  }, []);

  return (
    <>
      <Modal
        title="Новая заявка"
        size="wide"
        closeOnEscape={previewId === null && !confirmOpen}
        onClose={onClose}
        footer={
          <>
            <Button variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button disabled={!canCreate} onClick={tryCreate}>
              Создать
            </Button>
          </>
        }
      >
        <div className={styles.layout}>
          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              tryCreate();
            }}
          >
            <label>
              Адрес
              <input
                ref={addressRef}
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Улица, дом"
              />
            </label>
            <label>
              Описание
              <textarea
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Суть обращения, детали для бригады"
              />
            </label>
            <label>
              Тип
              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value as RequestType)
                }
              >
                <option value="emergency">Аварийная</option>
                <option value="planned">Плановая</option>
              </select>
            </label>
            <label>
              Вид работ
              <select
                value={workType}
                onChange={(event) => setWorkType(event.target.value)}
              >
                {WORK_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Источник
              <select
                value={source}
                onChange={(event) => setSource(event.target.value)}
              >
                {SOURCES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </form>

          <aside className={styles.matches} aria-live="polite">
            <h3>Совпадения по адресу</h3>
            {address.trim().length < 2 ? (
              <p className={styles.hint}>Начните вводить адрес — от 2 символов.</p>
            ) : matches.length === 0 ? (
              <p className={styles.hint}>Совпадений нет</p>
            ) : (
              <ul>
                {matches.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={styles.matchItem}
                      onClick={() => setPreviewId(item.id)}
                    >
                      <strong>№{item.id}</strong>
                      <span>{item.address}</span>
                      <span className={styles.matchMeta}>
                        {requestTypeLabel(item.type)} ·{" "}
                        {requestStatusLabel(item.status)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </Modal>

      {preview && !confirmOpen ? (
        <Modal
          title={`Заявка №${preview.id}`}
          nested
          highlight
          onClose={() => setPreviewId(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setPreviewId(null)}>
                Отмена
              </Button>
              <Button onClick={() => onContinueExisting(preview.id)}>
                Открыть существующую
              </Button>
            </>
          }
        >
          <p className={styles.matchCaption}>Совпадение по адресу</p>
          <dl className={styles.preview}>
            <div>
              <dt>Адрес</dt>
              <dd>{preview.address}</dd>
            </div>
            <div>
              <dt>Тип</dt>
              <dd>
                <Badge
                  tone={preview.type === "emergency" ? "emergency" : "planned"}
                >
                  {requestTypeLabel(preview.type)}
                </Badge>
              </dd>
            </div>
            <div>
              <dt>Статус</dt>
              <dd>
                <Badge tone={requestStatusTone(preview.status)}>
                  {requestStatusLabel(preview.status)}
                </Badge>
              </dd>
            </div>
            <div>
              <dt>Работы</dt>
              <dd>{preview.workType}</dd>
            </div>
            <div>
              <dt>Исполнитель</dt>
              <dd>{preview.executorName ?? "Не назначен"}</dd>
            </div>
            <div>
              <dt>Бригада</dt>
              <dd>{previewCrew ? previewCrew.name : "Не назначена"}</dd>
            </div>
            {preview.description ? (
              <div className={styles.previewDescription}>
                <dt>Описание</dt>
                <dd className={styles.description}>{preview.description}</dd>
              </div>
            ) : null}
          </dl>
        </Modal>
      ) : null}

      {confirmOpen ? (
        <Modal
          title="Есть совпадения по адресу. Вы действительно хотите создать новую?"
          nested
          onClose={() => setConfirmOpen(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
                Нет
              </Button>
              <Button
                onClick={() => {
                  setConfirmOpen(false);
                  onCreate(draft());
                }}
              >
                Да
              </Button>
            </>
          }
        >
          <p className={styles.hint}>
            Найдены активные заявки с похожим адресом. Можно вернуться к форме и
            открыть совпадение.
          </p>
        </Modal>
      ) : null}
    </>
  );
}
