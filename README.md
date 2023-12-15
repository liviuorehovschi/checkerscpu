# Checkers Game Application Setup Guide

This document provides the instructions for setting up the environment for the checkers game (Python).

## Prerequisites

Ensure you have the following prerequisites installed before proceeding with the setup:
- Python 3.6 or later
- Git

## Setup

To set up, follow these steps:

### 1. Clone the Repository

Clone the code from the GitHub repository.

```bash
git clone https://github.com/liviuorehovschi/checkerscpu.git
```

### 2. Create the Virtual Environment

Isolate your Python environment by creating a virtual environment.

```bash
python3 -m venv todo-list
```

### 3. Activate the Virtual Environment

Activate the created virtual environment.

Unix or MacOS
```bash
source todo-list/bin/activate
```

Windows
```bash
todo-list\Scripts\activate
```

### 4. Install the Requirements

Install the necessary Python packages defined in requirements.txt.

```bash
pip3 install -r requirements.txt
```

### 5. Run the Server

Execute the following command to run the server.

```bash
python app.py
```
To test the codes using the unit tests in test.py run the following.

```bash
python test.py
```
