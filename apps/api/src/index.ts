import { defineAbilityFor, projectSchema } from '@saas/auth';

const ability = defineAbilityFor({ role: 'MEMBER', id: '1' });
const project = projectSchema.parse({
  id: '123',
  ownerId: '123',
});

console.log(ability.can('create', 'Invite'));
console.log(ability.can('delete', project));
