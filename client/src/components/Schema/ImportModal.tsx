import { Group, Text } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { IconUpload, IconX, IconFile } from '@tabler/icons-react';
import { useContext } from 'react';
import SchemaContext from '../../providers/SchemaContext';
import useAPI from '../../hooks/useAPI';
import '@mantine/dropzone/styles.css';

export default function ImportModal({ close }: { close(): void }) {
    const { schema, reload } = useContext(SchemaContext);
    const { post, loading, error } = useAPI({
        url: `/schema/${schema?.name}/import`,
        headers: { 'Content-Type': 'multipart/form-data' },
        modify: (d) => { console.log(d); return d},
        then: () => { close(); reload(); }
    });
    const upload = (files: FileWithPath[]) => {
        const formData = new FormData();
        formData.append('file', files[0]);
        post({data: formData});
    }
    return (
    <Dropzone loading={loading} onDrop={upload} accept={['application/zip', 'application/x-zip-compressed']} >
        <Group justify="center" gap="xl" mih={200} style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept><IconUpload size={50} stroke={1.5} /></Dropzone.Accept>
            <Dropzone.Reject><IconX size={50} stroke={1.5} /></Dropzone.Reject>
            <Dropzone.Idle><IconFile size={50} stroke={1.5} /></Dropzone.Idle>
            <div>
                <Text size="xl" inline>Drag schema here or click to select file</Text>
                <Text size="sm" c="dimmed" inline mt={7}>Import files must be generated by the schema export function</Text>
                {error&&<Text c="red" inline mt={7}>{error}</Text>}
            </div>
        </Group>
    </Dropzone>
    )
}