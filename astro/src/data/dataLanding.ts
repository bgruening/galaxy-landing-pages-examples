export const dataLanding = {
  name: "Example BED file",
  description: "A small BED file hosted on the Galaxy GitHub repo.",
  fileUrl: "https://raw.githubusercontent.com/galaxyproject/galaxy/dev/test-data/1.bed",
  ext: "bed",
};

export const advancedDataLanding = {
  name: "PRJDB3920 FASTQ batch",
  description: "Paired FASTQ collection with deferred data from the PRJDB3920 rules table.",
  rulesFileUrl:
    "https://raw.githubusercontent.com/galaxyproject/galaxy/dev/test-data/rules/PRJDB3920.tsv",
  ext: "fastqsanger.gz",
  tags: ["source:rules", "project:PRJDB3920"],
  files: [
    "https://ftp.sra.ebi.ac.uk/vol1/fastq/DRR039/DRR039919/DRR039919_1.fastq.gz",
    "https://ftp.sra.ebi.ac.uk/vol1/fastq/DRR039/DRR039919/DRR039919_2.fastq.gz",
    "https://ftp.sra.ebi.ac.uk/vol1/fastq/DRR039/DRR039920/DRR039920_1.fastq.gz",
    "https://ftp.sra.ebi.ac.uk/vol1/fastq/DRR039/DRR039920/DRR039920_2.fastq.gz",
    "https://ftp.sra.ebi.ac.uk/vol1/fastq/DRR039/DRR039921/DRR039921_1.fastq.gz",
    "https://ftp.sra.ebi.ac.uk/vol1/fastq/DRR039/DRR039921/DRR039921_2.fastq.gz",
  ],
};
