import { ActionIcon, Box, Button, Center, Grid, Group, Switch, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconAt, IconBinaryTree2, IconCode, IconFolder, IconGripVertical, IconHierarchy, IconKey, IconTrash, IconUser } from "@tabler/icons-react";
import SelectConnector from "../../../Common/SelectConnector";
import Concealer from "../../../Common/Concealer";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ldapAttributes } from "../../../../data/common";
import { SelectCreatable } from "../../../Common/SelectCreatable";

function SecurityGroups( { form, index, explore }: { form: UseFormReturnType<Rule>, index: number, explore: explore } ) {
    const data = (form.values.actions[index].groups || []) as string[];
    const modifyCondition = (index2: number)=> () => explore(() => (value: string) =>
    form.setFieldValue(`actions.${index}.groups.${index2}`, `${form.values.actions[index].groups[index2]||''}{{${value}}}`) );
    const explorer = (index2: number) => <ActionIcon
    onClick={modifyCondition(index2)}
    variant="subtle" ><IconCode size={16} style={{ display: 'block', opacity: 0.8 }} />
    </ActionIcon>
  
    return (<>
        {data.length===0&&<Center c="dimmed" fz="xs" >No security groups configured.</Center>}
        <DragDropContext
        onDragEnd={({ destination, source }) => form.reorderListItem(`actions.${index}.groups`, { from: source.index, to: destination? destination.index : 0 }) }
        >
        <Droppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
            <div {...provided.droppableProps} style={{top: "auto",left: "auto"}} ref={provided.innerRef}>
                {data.map((_, index2) => (
                <Draggable key={index2} index={index2} draggableId={index2.toString()}>
                    {(provided) => (
                    <Grid gutter="xs" align="center" ref={provided.innerRef} mt="xs" {...provided.draggableProps}
                    style={{ ...provided.draggableProps.style, left: "auto !important", top: "auto !important", }}
                    >
                        <Grid.Col span="content" style={{ cursor: 'grab' }} {...provided.dragHandleProps}  >
                            <Group><IconGripVertical size="1.2rem" /></Group>
                        </Grid.Col>
                        <Grid.Col span="auto">
                            <TextInput
                                placeholder="CN={{faculty}},OU={{faculty}},OU=Child,OU=Parent"
                                {...form.getInputProps(`actions.${index}.groups.${index2}`)}
                                rightSection={explorer(index2)}
                            />
                        </Grid.Col>
                        <Grid.Col span="content">
                            <Group gap={0} justify="flex-end">
                                <ActionIcon onClick={()=>form.removeListItem(`actions.${index}.groups`, index2)} variant="subtle" color="red">
                                    <IconTrash size="1.2rem" stroke={1.5} />
                                </ActionIcon>
                            </Group>
                        </Grid.Col>
                    </Grid>
                    )}
                </Draggable>
                ))}
                {provided.placeholder}
            </div>
            )}
        </Droppable>
        </DragDropContext>
        </>
    );
}

function Attributes( { form, index, explore }: { form: UseFormReturnType<Rule>, index: number, explore: explore } ) {
    const data = (form.values.actions[index].attributes || []);
    const modifyCondition = (key: string, index2: number)=> () => explore(() => (value: string) =>
    form.setFieldValue(`actions.${index}.attributes.${index2}.${key}`, `${form.values.actions[index].attributes[index2][key]||''}{{${value}}}`) );
    const explorer = (key: string, index2: number) => <ActionIcon
    onClick={modifyCondition(key, index2)}
    variant="subtle" ><IconCode size={16} style={{ display: 'block', opacity: 0.8 }} />
    </ActionIcon>
  
    return (<>
        {data.length===0&&<Center c="dimmed" fz="xs" >No attributes configured.</Center>}
        <DragDropContext
        onDragEnd={({ destination, source }) => form.reorderListItem(`actions.${index}.attributes`, { from: source.index, to: destination? destination.index : 0 }) }
        >
        <Droppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
            <div {...provided.droppableProps} style={{top: "auto",left: "auto"}} ref={provided.innerRef}>
                {data.map((_, index2) => (
                <Draggable key={index2} index={index2} draggableId={index2.toString()}>
                    {(provided) => (
                    <Grid gutter="xs" align="center" ref={provided.innerRef} mt="xs" {...provided.draggableProps}
                    style={{ ...provided.draggableProps.style, left: "auto !important", top: "auto !important", }}
                    >
                        <Grid.Col span="content" style={{ cursor: 'grab' }} {...provided.dragHandleProps}  >
                            <Group><IconGripVertical size="1.2rem" /></Group>
                        </Grid.Col>
                        <Grid.Col span="auto">
                            <SelectCreatable
                            selectable={ldapAttributes}
                            {...form.getInputProps(`actions.${index}.attributes.${index2}.name`)}
                            createLabel={(query) => `Add Custom Attribute: ${query}`}
                            />
                        </Grid.Col>
                        <Grid.Col span="auto">
                            <TextInput
                                placeholder="Value"
                                {...form.getInputProps(`actions.${index}.attributes.${index2}.value`)}
                                rightSection={explorer('value', index2)}
                            />
                        </Grid.Col>
                        <Grid.Col span="content">
                            <Group gap={0} justify="flex-end">
                                <ActionIcon onClick={()=>form.removeListItem(`actions.${index}.attributes`, index2)} variant="subtle" color="red">
                                    <IconTrash size="1.2rem" stroke={1.5} />
                                </ActionIcon>
                            </Group>
                        </Grid.Col>
                    </Grid>
                    )}
                </Draggable>
                ))}
                {provided.placeholder}
            </div>
            )}
        </Droppable>
        </DragDropContext>
        </>
    );
}

export default function CreateUser( { form, index, explorer, explore }: ActionItem){
    if (!form.values.actions[index].attributes) form.setFieldValue(`actions.${index}.attributes`, []);
    if (!form.values.actions[index].groups) form.setFieldValue(`actions.${index}.groups`, []);
    const addA = () => form.insertListItem(`actions.${index}.attributes`, {name:'',value:''});
    const addG = () => form.insertListItem(`actions.${index}.groups`, '');
    return (
    <Box p="xs" pt={0} >
        <SelectConnector
            label="Target Directory" withAsterisk
            clearable
            leftSection={<IconBinaryTree2 size="1rem" />}
            {...form.getInputProps(`actions.${index}.target`)}
            type="ldap"
        />
        <TextInput
            label="Canonical Name" withAsterisk
            leftSection={<IconUser size={16} style={{ display: 'block', opacity: 0.8 }}/>}
            placeholder="{{username}}"
            {...form.getInputProps(`actions.${index}.cn`)}
            rightSection={explorer('cn')}
        />
        <TextInput
            label="User Principal Name" withAsterisk
            leftSection={<IconAt size={16} style={{ display: 'block', opacity: 0.8 }}/>}
            placeholder="{{username}}@domain.com"
            {...form.getInputProps(`actions.${index}.upn`)}
            rightSection={explorer('upn')}
        />
        <TextInput
            label="SAM Account Name" withAsterisk
            leftSection={<IconHierarchy size={16} style={{ display: 'block', opacity: 0.8 }}/>}
            placeholder="{{username}}"
            {...form.getInputProps(`actions.${index}.sam`)}
            rightSection={explorer('sam')}
        />
        <TextInput
            label="Organizational Unit" withAsterisk
            leftSection={<IconFolder size={16} style={{ display: 'block', opacity: 0.8 }}/>}
            placeholder="ou={{faculty}},ou=child,ou=parent"
            {...form.getInputProps(`actions.${index}.ou`)}
            rightSection={explorer('ou')}
        />
        <TextInput
            label="Password"
            leftSection={<IconKey size={16} style={{ display: 'block', opacity: 0.8 }}/>}
            placeholder="{{word}}{{rand 1 9}}{{cap (word)}}{{special}}"
            {...form.getInputProps(`actions.${index}.password`)}
            rightSection={explorer('password')}
        />
        <Switch label="User Enabled" disabled={form.values.actions[index].password===""}
        mt="xs" {...form.getInputProps(`actions.${index}.enable`, { type: 'checkbox' })}
        />
        <Concealer open label='Attributes' rightSection={<Button onClick={()=>addA()} maw={50} variant="light" size='compact-xs' mt={10}>Add</Button>} >
            <Attributes form={form} index={index} explore={explore} />
        </Concealer>
        <Concealer open label='Security Groups' rightSection={<Button onClick={()=>addG()} maw={50} variant="light" size='compact-xs' mt={10}>Add</Button>} >
            <SecurityGroups form={form} index={index} explore={explore} />
        </Concealer>
    </Box>
    )
}