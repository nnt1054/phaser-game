import TempJob from './temp';
import HealerJob from './healer';
import MeleeJob from './melee';
import CasterJob from './caster';

const jobMap = {
    'TMP': TempJob,
    'HEAL': HealerJob,
    'MELEE': MeleeJob,
    'SPELL': CasterJob,
}

export default jobMap;
