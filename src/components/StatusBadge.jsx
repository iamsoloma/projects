import { getStatusLabel } from "../utils/format";

export default function StatusBadge({status}) {
    return <span className={`badge badge--${status}`}>{getStatusLabel(status)}</span>
}