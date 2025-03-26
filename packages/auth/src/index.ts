import { z } from 'zod';
import {
  createMongoAbility,
  CreateAbility,
  MongoAbility,
  AbilityBuilder,
} from '@casl/ability';
import { User } from './models/user';
import { permissions } from './permissions';
import { userSubject } from './subjects/user';
import { projectSubject } from './subjects/project';
import { billingSubject } from './subjects/billing';
import { inviteSubject } from './subjects/invite';
import { organizationSubject } from './subjects/organization';

export * from './models/organization';
export * from './models/project';
export * from './models/user';

const appAbilitiesSchema = z.union([
  billingSubject,
  inviteSubject,
  organizationSubject,
  projectSubject,
  userSubject,
  z.tuple([z.literal('manage'), z.literal('all')]),
]);

export type AppAbilities = z.infer<typeof appAbilitiesSchema>;

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export const defineAbilityFor = (user: User) => {
  const builder = new AbilityBuilder(createAppAbility);

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} are not defined`);
  }

  permissions[user.role](user, builder);

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename;
    },
  });

  return ability;
};
