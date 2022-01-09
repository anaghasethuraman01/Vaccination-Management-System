package edu.sjsu.cmpe275.vms.model;

public enum Role {
    Patient("ROLE_PATIENT"),
    Admin("ROLE_ADMIN");

    private final String roleName;

    Role(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleName() {
        return this.roleName;
    }
}
