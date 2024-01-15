import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ActionIcon, Box, Button, Grid, Group, Menu, Select, Text, TextInput, Tooltip, useMantineTheme } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconChevronDown, IconGripVertical, IconTrash, IconCode, IconCodeAsterix, IconDots, IconCopy } from "@tabler/icons-react";
import { useContext } from "react";
import ExplorerContext from "../../../providers/ExplorerContext";
import { availableConditions, mathOperators, stringOperators } from "../../../data/common";
import SchemaContext from "../../../providers/SchemaContext";
import SelectConnector from "../../Common/SelectConnector";

const groupOperators = [
  { label: 'Member of group', value: 'member' },
  { label: 'Not member of group', value: 'notmember' }
];
//TODO - :
//  - file/folder exists condition
const ouOperators = [
  { label: 'Child of organisational unit', value: 'child' },
  { label: 'Not child of organisational unit', value: 'notchild' }
];

const statusOperators = [
  { label: 'Exists on', value: 'exists' },
  { label: 'Does not exist on', value: 'notexists' },
  { label: 'Enabled on ', value: 'enabled' },
  { label: 'Disabled on', value: 'disabled' }
];

const noValues = [ 'status' ];
const noOperators: string[] = [];

interface ValueInput {
  form: UseFormReturnType<Rule>;
  index: number;
  modifyCondition: (key: string, index: number) => () => void;
  delimit: (index: number, delimiter: string) => () => void;
  delimited: (index: number, delimiter: string) => boolean;
}
function ValueInput( { form, index, modifyCondition, delimit, delimited }: ValueInput ) {
  const icon =
  delimited(index, '') ? <IconDots size={16} style={{ display: 'block', opacity: 0.8 }} />:
  <IconCodeAsterix size={16} style={{ display: 'block', opacity: 0.8 }} />

  return (
    <TextInput placeholder='Value'
    {...form.getInputProps(`conditions.${index}.value`)}
    rightSection={
      <Button.Group style={{marginRight:30}} >
        <Menu position="bottom-end" >
            <Menu.Target><ActionIcon variant="subtle" >{icon}</ActionIcon></Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={delimit(index, '')} disabled={delimited(index, '')}>No Delimiter</Menu.Item>
              <Menu.Item onClick={delimit(index, ',')} disabled={delimited(index, ',')} >Comma ,</Menu.Item>
              <Menu.Item onClick={delimit(index, ';')} disabled={delimited(index, ';')} >Semicolon ;</Menu.Item>
              <Menu.Item onClick={delimit(index, '|')} disabled={delimited(index, '|')} >Bar |</Menu.Item>
              <Menu.Item onClick={delimit(index, 'tab')} disabled={delimited(index, 'tab')} >Tab</Menu.Item>
              <Menu.Item onClick={delimit(index, ' ')} disabled={delimited(index, ' ')} >Space</Menu.Item>
            </Menu.Dropdown>
        </Menu>
        <ActionIcon variant="subtle" ><IconCode onClick={modifyCondition('value',index)} size={16} style={{ display: 'block', opacity: 0.8 }} /></ActionIcon>
      </Button.Group>
    }
    />
  )
}

export default function Conditions( { form, label }: {form: UseFormReturnType<Rule>, label?: string } ) {
  const theme = useMantineTheme();
  const { explorer, explore, } = useContext(ExplorerContext);
  const { _connectors } = useContext(SchemaContext);
  const add = (type: string, operator?: string) => () => form.insertListItem('conditions', {
    type,
    key: '',
    operator: operator || ((type == 'string' || type == 'math') ? '==' : ''),
    value: '',
    delimiter: ''
  });
  const copy = (v: Condition) => () => form.insertListItem('conditions', {...v});
  const remove  = (index: number) => () => form.removeListItem('conditions', index);
  const modifyCondition = (key: string, index: number)=> () =>
  explore(() => (value: string) =>
  form.setFieldValue(`conditions.${index}.${key}`, `${form.values.conditions[index][key]||''}{{${value}}}`) );

  const delimit = (index: number, delimiter: string) => () => form.setFieldValue(`conditions.${index}.delimiter`,  delimiter );
  const delimited = (index: number, delimiter: string) => form.values.conditions[index].delimiter === delimiter;

  const hasLDAP = ( (form.values.primary in _connectors) && _connectors[form.values.primary].id === "ldap" ) ||
  (form.values.secondaries||[]).filter(s=>(s.primary in _connectors) && _connectors[s.primary].id === "ldap").length>0;


  return ( //TODO - add enable/disable etc
    <Box>
        {explorer}
        <Group grow justify="apart" mb="xs" mt="xs" gap="xs">
            <Text c="dimmed" size="sm" >{label||"All conditions here will be evaluated and must be true for actions to be executed."}</Text>
            <Group justify="right" gap="xs">
                <Menu position="bottom-end" >
                    <Menu.Target>
                        <Button variant="light" rightSection={<IconChevronDown size="1.05rem" stroke={1.5} />} pr={12}>Add condition</Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>Data Sources</Menu.Label>
                      {availableConditions.filter(c=>!c.connector).map(c=>
                        <Menu.Item key={c.id} onClick={add(c.id)} leftSection={<c.Icon color={theme.colors[c.color][6]} size="1rem" stroke={1.5} />}>{c.label}</Menu.Item>
                      )}
                      {hasLDAP&&<>
                      <Menu.Label>Directory</Menu.Label>
                      {availableConditions.filter(c=>c.connector==="ldap").map(c=>
                        <Menu.Item key={c.id} onClick={add(c.id, c.id)} leftSection={<c.Icon color={theme.colors[c.color][6]} size="1rem" stroke={1.5} />}>{c.label}</Menu.Item>
                      )}
                      </>}
                    </Menu.Dropdown>
                </Menu>
            </Group>
        </Group>
        {(form.values.conditions||[]).length===0&&<Text c="lighter" size="sm" >No conditions in effect. Rules must have at least one condition to evaluate.</Text>}
        <DragDropContext
        onDragEnd={({ destination, source }) => form.reorderListItem('conditions', { from: source.index, to: destination? destination.index : 0 }) }
        >
        <Droppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
            <div {...provided.droppableProps} style={{top: "auto",left: "auto"}} ref={provided.innerRef}>
            {(form.values.conditions||[]).map((c, index)=> {
              const condition = availableConditions.filter(x=>x.id===c.type)[0];
              return <Draggable key={index} index={index} draggableId={index.toString()}>
                    {(provided) => (
                    <Grid align="center" ref={provided.innerRef} mt="xs" {...provided.draggableProps} gutter="xs"
                    style={{ ...provided.draggableProps.style, left: "auto !important", top: "auto !important", }}
                    >
                        <Grid.Col span="content" style={{ cursor: 'grab' }} {...provided.dragHandleProps}  >
                            <Group><IconGripVertical size="1.2rem" /></Group>
                        </Grid.Col>
                        <Grid.Col span="content" >
                            <Group><Tooltip label={condition.label}><condition.Icon color={theme.colors[condition.color][6]} size="1.2rem" /></Tooltip></Group>
                        </Grid.Col>
                        {noOperators.includes(c.type)&&
                        <Grid.Col c="dimmed" span="content">
                          {condition.label}
                        </Grid.Col>}
                          {(c.type==='string'||c.type==='math')?
                        <Grid.Col span="auto">
                          <TextInput placeholder='Key'
                          {...form.getInputProps(`conditions.${index}.key`)}
                          rightSection={ <ActionIcon
                            onClick={modifyCondition('key',index)}
                            variant="subtle" ><IconCode size={16} style={{ display: 'block', opacity: 0.8 }} /></ActionIcon>
                          }
                          />
                        </Grid.Col>:
                        <Grid.Col span="auto">
                            <SelectConnector clearable
                            {...form.getInputProps(`conditions.${index}.key`)}
                            filter={data=>data.filter(c=>c.id==="ldap")}
                            />
                        </Grid.Col>
                        }
                        {!noOperators.includes(c.type)&&
                        <Grid.Col span="content">
                          <Select
                            placeholder="Operator"
                            checkIconPosition="right"
                            data={ {
                              string: stringOperators,
                              math: mathOperators,
                              group: groupOperators,
                              ou: ouOperators,
                              status: statusOperators,
                            }[c.type]
                            } maxDropdownHeight={300}
                            {...form.getInputProps(`conditions.${index}.operator`)}
                          />
                        </Grid.Col>}
                        {!noValues.includes(c.type)&&<Grid.Col span="auto">
                            <ValueInput form={form} index={index} delimit={delimit} delimited={delimited} modifyCondition={modifyCondition} />
                        </Grid.Col>}
                        <Grid.Col span="content">
                            <Group justify="right" gap="xs">
                                <ActionIcon onClick={remove(index)} variant="default" size="lg"><IconTrash size={15}/></ActionIcon>
                                <ActionIcon onClick={copy(c)} variant="default" size="lg"><IconCopy size={15}/></ActionIcon>
                            </Group>
                        </Grid.Col>
                    </Grid>)}
                </Draggable>
              }
                )
            }
            {provided.placeholder}
            </div>
            )}
        </Droppable>
        </DragDropContext>

    </Box>
  )
}