package edu.sjsu.cmpe275.vms.config;

import org.hibernate.HibernateException;
import org.hibernate.MappingException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.Configurable;
import org.hibernate.id.IdentifierGenerator;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.type.Type;

import java.io.Serializable;
import java.util.Properties;
import java.util.concurrent.ThreadLocalRandom;

public class MrnGenerator implements IdentifierGenerator, Configurable {

    private Long min;

    private Long max;

    @Override
    public Serializable generate( SharedSessionContractImplementor session,
                                  Object obj) throws HibernateException {
        return ThreadLocalRandom.current().nextLong(min, max + 1);
    }

    @Override
    public void configure(Type type, Properties properties,
                          ServiceRegistry serviceRegistry) throws MappingException {
        min = Long.valueOf(properties.getProperty("min"));
        max = Long.valueOf(properties.getProperty("max"));
    }
}
