import { FiCpu, FiTag, FiHome, FiActivity, FiBookOpen, FiFeather, FiGift, FiTool } from 'react-icons/fi';

const MAP = { FiCpu, FiTag, FiHome, FiActivity, FiBookOpen, FiFeather, FiGift, FiTool };

export default function CategoryIcon({ name, size = 20, className = '' }) {
  const Icon = MAP[name] || FiTag;
  return <Icon size={size} className={className} />;
}
