import { strategyRegistry } from './registry.js';
import { CustomUsersStrategy } from './CustomUsers.strategy.js';
import { DepartmentStrategy } from './Department.strategy.js';
import { HrBroadcastStrategy } from './HrBroadcast.strategy.js';

strategyRegistry.register('Employee-Specific', CustomUsersStrategy);
strategyRegistry.register('Department-Specific', DepartmentStrategy);
strategyRegistry.register('ALL_EMPLOYEES', HrBroadcastStrategy);
