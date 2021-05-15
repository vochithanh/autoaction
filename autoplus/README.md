# AutoPlus
Sample to extends `AutoAction` by adding more action.
In this sample, we add new action `InputR` which fill in random value by pattern.
- `*` will be replace by a character from a-z
- `#` will be replace by a number from 0-9

e.g. `***###@***.com` would be `abc123@acb.com`

# How to do
- Extends current actions from `AutoAction` framework (this case is `ActionInput` )
- Create new file with extension *.amap (this case is `\autobot\bot\workspace\plus\plus.amap` )to register new action
- Create new file with extension *.param (this case is `\autobot\bot\workspace\plus\plus.param` ) to tell system how to parse the params of this action based on regular expression syntax.

# Deploy
- Create a folder under `\autobot\bot\workspace` (this case is `\autobot\bot\workspace\plus` )
- Run gradle `jar` task to generate jar file (this case the jar file destination is `\autobot\bot\workspace\plus\autoplus.jar`)
- Done and enjoy the new action :banana:

