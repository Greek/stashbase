import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { File } from '@api/types/file';

export default function FilesList({
  files,
}: {
  files: Omit<File, 'uploaderId' | 'spaceId' | 'id'>[];
}) {
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Filename</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Uploaded</TableHead>
          <TableHead>Uploader</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <TableRow key={file.slug}>
            <TableCell className="font-medium">{file.filename}</TableCell>
            <TableCell>{file.mimeType || 'Unknown'}</TableCell>
            <TableCell>
              {file.createdAt ? formatDate(file.createdAt) : 'Unknown'}
            </TableCell>
            <TableCell>{file.uploader?.name || 'Unknown'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
