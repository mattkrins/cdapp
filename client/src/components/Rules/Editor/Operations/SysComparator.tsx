import { useForm } from "@mantine/form";
import Conditions from "../Conditions";
import { Box, Grid, Switch, TextInput, Textarea } from "@mantine/core";
import { IconBraces, IconCheck, IconX } from "@tabler/icons-react";
import { useEffect } from "react";

export default function SysComparator( { form, index, inputProps, actionType }: ActionItem ) {
    const initialValues = {conditions: form.values[actionType][index].conditions||[]} as unknown as Rule;
    const form2 = useForm({ initialValues, validate: {} });
    const checked = form.values[actionType][index].output||false;
    useEffect(() => {
        form.setFieldValue(`${actionType}.${index}.conditions`, form2.values.conditions)
    }, [JSON.stringify(form2.values.conditions)]);
    
    const taken = (form.values.secondaries||[]).map((s: {primary:string})=>s.primary);
    const sources = [form.values.primary, ...taken];

    return (
    <Box>
        <Conditions form={form2} label="This action can halt futher execution, or build conditional templates." action sources={sources} />
        <Switch label="Output result to template"
        description={checked?undefined:"Execution will currently be halted if conditions do not pass."}
        mt="xs" mb="xs" {...form.getInputProps(`${actionType}.${index}.output`, { type: 'checkbox' })}
        />
        {checked&&
        <Box>
            <TextInput
            label="Template Key" withAsterisk
            description="Template key will contain output string based on conditions evaluating."
            placeholder="result"
            leftSection={<IconBraces size={16} style={{ display: 'block', opacity: 0.8 }}/>}
            {...inputProps('target')}
            />
            <Grid gutter="xs" align="center" mt="xs" mb="xs" >
                <Grid.Col span="auto">
                    <Textarea
                    placeholder="true"
                    autosize maxRows={4}
                    leftSection={<IconCheck size={16} style={{ display: 'block', opacity: 0.8 }}/>}
                    {...inputProps('true')}
                    />
                </Grid.Col>
                <Grid.Col span="auto">
                    <Textarea
                    placeholder="false"
                    autosize maxRows={4}
                    leftSection={<IconX size={16} style={{ display: 'block', opacity: 0.8 }}/>}
                    {...inputProps('false')}
                    />
                </Grid.Col>
            </Grid>
        </Box>}
    </Box>
    )
}
